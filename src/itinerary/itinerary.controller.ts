import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItineraryService } from './itinerary.service';
import { ItineraryResponse } from './interfaces/itinerary.interface';

@ApiTags('Itinerary')
@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate a travel itinerary and email it to the user',
    description: 'Generates a day-by-day itinerary using Google Gemini API and sends the styled travel plan HTML email using Resend.',
  })
  @ApiResponse({
    status: 201,
    description: 'The itinerary has been successfully generated and emailed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed for inputs.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Failed to generate itinerary or send email.',
  })
  async create(
    @Body() createItineraryDto: CreateItineraryDto,
  ): Promise<ItineraryResponse> {
    return this.itineraryService.createItinerary(createItineraryDto);
  }
}
