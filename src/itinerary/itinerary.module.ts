import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { GeminiService } from './gemini.service';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [ItineraryController],
  providers: [ItineraryService, GeminiService, EmailService],
})
export class ItineraryModule {}
