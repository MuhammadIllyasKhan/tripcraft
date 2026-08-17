import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ItineraryResponse } from './interfaces/itinerary.interface';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey || '');
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
  }

  async sendItineraryEmail(to: string, plan: ItineraryResponse): Promise<void> {
    const htmlContent = this.buildHtmlTemplate(plan);

    try {
      const response = await this.resend.emails.send({
        from: `TripCraft AI <${this.fromEmail}>`,
        to,
        subject: `Your Custom Travel Itinerary for ${plan.destination}`,
        html: htmlContent,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
    } catch (error: any) {
      // Capture email dispatch failures to Sentry for direct observability
      Sentry.captureException(error, {
        tags: { service: 'resend', error_type: 'email_dispatch_failed' },
        extra: { to, destination: plan.destination },
      });
      throw new InternalServerErrorException(
        `Failed to send email via Resend: ${error.message || error}`,
      );
    }
  }

  private buildHtmlTemplate(plan: ItineraryResponse): string {
    const hotelRows = plan.hotels
      .map(
        (hotel) => `
        <div style="background-color: #1e1e2e; border: 1px solid #313244; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
          <h4 style="margin: 0 0 5px 0; color: #89b4fa; font-size: 16px;">${hotel.name}</h4>
          <p style="margin: 0 0 8px 0; color: #a6adc8; font-size: 13px;">📍 ${hotel.address}</p>
          <p style="margin: 0 0 8px 0; color: #cdd6f4; font-size: 14px;">${hotel.description}</p>
          <span style="font-weight: bold; color: #a6e3a1; font-size: 14px;">$${hotel.pricePerNight} / night</span>
        </div>
      `,
      )
      .join('');

    const dailyItineraryHtml = plan.dailyItinerary
      .map((dayPlan) => {
        const activitiesHtml = dayPlan.activities
          .map(
            (act) => `
            <div style="border-left: 3px solid #b4befe; padding-left: 12px; margin-bottom: 10px;">
              <strong style="color: #b4befe; font-size: 13px; text-transform: uppercase;">${act.time}</strong>
              <div style="color: #cdd6f4; font-size: 15px; font-weight: 500; margin: 2px 0;">${act.activity}</div>
              <div style="color: #a6adc8; font-size: 13px;">📍 ${act.location} <span style="color: #a6e3a1; margin-left: 10px;">Est. Cost: $${act.estimatedCost}</span></div>
            </div>
          `,
          )
          .join('');

        return `
          <div style="margin-bottom: 25px; background-color: #181825; border-radius: 10px; padding: 20px; border: 1px solid #313244;">
            <h3 style="margin: 0 0 15px 0; color: #f9e2af; font-size: 18px; border-bottom: 1px solid #313244; padding-bottom: 8px;">Day ${dayPlan.day} - ${dayPlan.theme}</h3>
            ${activitiesHtml}
          </div>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #11111b;
            color: #cdd6f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1e1e2e;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid #313244;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #313244;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            background: linear-gradient(90deg, #b4befe, #89b4fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        </style>
      </head>
      <body>
        <div class="container" style="background-color: #11111b; border: 1px solid #313244; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 25px;">
          <div class="header" style="text-align: center; border-bottom: 1px solid #313244; padding-bottom: 20px; margin-bottom: 25px;">
            <h1 style="margin: 0; font-size: 28px; color: #89b4fa;">✈️ TripCraft AI</h1>
            <p style="margin: 5px 0 0 0; color: #a6adc8; font-size: 14px;">Your Tailored Adventure Awaits</p>
          </div>
          
          <div style="margin-bottom: 25px; background: linear-gradient(135deg, #1e1e2e, #11111b); border-radius: 10px; padding: 20px; border: 1px solid #313244; text-align: center;">
            <h2 style="margin: 0 0 10px 0; color: #cdd6f4; font-size: 20px;">Destination: ${plan.destination}</h2>
            <p style="margin: 0; color: #a6adc8; font-size: 14px;">Duration: <strong>${plan.days} Days</strong> | Budget: <strong>${plan.budget}</strong></p>
          </div>

          <h3 style="color: #b4befe; font-size: 18px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Recommended Hotels</h3>
          <div style="margin-bottom: 25px;">
            ${hotelRows}
          </div>

          <h3 style="color: #b4befe; font-size: 18px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Daily Itinerary</h3>
          ${dailyItineraryHtml}

          <h3 style="color: #b4befe; font-size: 18px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Cost Breakdown</h3>
          <div style="background-color: #1e1e2e; border: 1px solid #313244; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; color: #cdd6f4; font-size: 14px;">
              <tr style="border-bottom: 1px solid #313244;">
                <td style="padding: 8px 0; color: #a6adc8;">Total Hotel Cost</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${plan.costBreakdown.hotelsTotal}</td>
              </tr>
              <tr style="border-bottom: 1px solid #313244;">
                <td style="padding: 8px 0; color: #a6adc8;">Total Activities Cost</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${plan.costBreakdown.activitiesTotal}</td>
              </tr>
              <tr style="border-bottom: 1px solid #313244;">
                <td style="padding: 8px 0; color: #a6adc8;">Food & Miscellaneous (Estimated)</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${plan.costBreakdown.foodAndMiscEstimated}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold;">
                <td style="padding: 12px 0 0 0; color: #a6e3a1;">Grand Total</td>
                <td style="padding: 12px 0 0 0; text-align: right; color: #a6e3a1;">$${plan.costBreakdown.grandTotal}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px; border-top: 1px solid #313244; padding-top: 20px; font-size: 12px; color: #585b70;">
            Generated by TripCraft AI. Have a wonderful and safe journey!
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
