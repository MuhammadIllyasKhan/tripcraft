import { Injectable, Logger } from '@nestjs/common';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { GeminiService } from './gemini.service';
import { EmailService } from './email.service';
import { ItineraryResponse } from './interfaces/itinerary.interface';

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly emailService: EmailService,
  ) {}

  async createItinerary(dto: CreateItineraryDto): Promise<ItineraryResponse> {
    this.logger.log(`Generating itinerary for ${dto.destination} (${dto.days} days, budget: ${dto.budget})`);
    
    // 1. Generate travel plan via Google Gemini API
    const plan = await this.geminiService.generateItinerary(
      dto.destination,
      dto.days,
      dto.budget,
    );

    // 2. Send email via Resend in background or await it
    // We will await it to ensure any errors during mailing are captured and reported/tracked by Sentry.
    this.logger.log(`Sending itinerary email to ${dto.email}`);
    await this.emailService.sendItineraryEmail(dto.email, plan);

    return plan;
  }
}
