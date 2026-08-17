import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ItineraryResponse } from './interfaces/itinerary.interface';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async generateItinerary(
    destination: string,
    days: number,
    budget: string,
  ): Promise<ItineraryResponse> {
    try {
      const prompt = `Generate a structured, day-by-day travel itinerary for a trip to "${destination}" for ${days} days with a "${budget}" budget.
Include a list of recommended budget/affordable hotels matching this budget level, a cost breakdown, and daily activities categorized by time of day (Morning, Afternoon, Evening).

Return ONLY a JSON object that strictly adheres to the following structure:
{
  "destination": string,
  "days": number,
  "budget": string,
  "hotels": [
    {
      "name": string,
      "address": string,
      "pricePerNight": number,
      "description": string
    }
  ],
  "dailyItinerary": [
    {
      "day": number,
      "theme": string,
      "activities": [
        {
          "time": "Morning" | "Afternoon" | "Evening",
          "activity": string,
          "location": string,
          "estimatedCost": number
        }
      ]
    }
  ],
  "costBreakdown": {
    "hotelsTotal": number,
    "activitiesTotal": number,
    "foodAndMiscEstimated": number,
    "grandTotal": number
  }
}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Google Gemini API');
      }

      const parsed = JSON.parse(text) as ItineraryResponse;
      return this.recalculateTotals(parsed);
    } catch (error: any) {
      if (
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('quota') ||
        error?.message?.includes('RESOURCE_EXHAUSTED')
      ) {
        // Capture quota errors to Sentry with extra context for debugging
        Sentry.captureException(error, {
          tags: { service: 'gemini', error_type: 'quota_exceeded' },
          extra: { destination, days, budget },
        });
        throw new InternalServerErrorException(
          'Google Gemini API Quota Exceeded: Please check your API key quota at https://aistudio.google.com/.',
        );
      }
      // Capture all other Gemini generation failures to Sentry
      Sentry.captureException(error, {
        tags: { service: 'gemini', error_type: 'generation_failed' },
        extra: { destination, days, budget },
      });
      throw new InternalServerErrorException(
        `Failed to generate itinerary from Google Gemini API: ${error.message || error}`,
      );
    }
  }

  private recalculateTotals(plan: ItineraryResponse): ItineraryResponse {
    let activitiesTotal = 0;
    if (Array.isArray(plan.dailyItinerary)) {
      for (const day of plan.dailyItinerary) {
        if (Array.isArray(day.activities)) {
          for (const activity of day.activities) {
            activitiesTotal += Number(activity.estimatedCost) || 0;
          }
        }
      }
    }

    let hotelsTotal = plan.costBreakdown?.hotelsTotal || 0;
    if (Array.isArray(plan.hotels) && plan.hotels.length > 0) {
      const avgPrice =
        plan.hotels.reduce((sum, h) => sum + (Number(h.pricePerNight) || 0), 0) /
        plan.hotels.length;
      hotelsTotal = Math.round(avgPrice * (plan.days || 1));
    }

    const foodAndMiscEstimated =
      Number(plan.costBreakdown?.foodAndMiscEstimated) || Math.round((plan.days || 1) * 50);
    const grandTotal = hotelsTotal + activitiesTotal + foodAndMiscEstimated;

    return {
      ...plan,
      costBreakdown: {
        hotelsTotal,
        activitiesTotal,
        foodAndMiscEstimated,
        grandTotal,
      },
    };
  }
}
