import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryService } from './itinerary.service';
import { GeminiService } from './gemini.service';
import { EmailService } from './email.service';
import { BudgetLevel } from './dto/create-itinerary.dto';
import { ItineraryResponse } from './interfaces/itinerary.interface';

describe('ItineraryService', () => {
  let service: ItineraryService;
  let mockGeminiService: jest.Mocked<Partial<GeminiService>>;
  let mockEmailService: jest.Mocked<Partial<EmailService>>;

  const mockItinerary: ItineraryResponse = {
    destination: 'Tokyo',
    days: 3,
    budget: 'Budget',
    hotels: [
      {
        name: 'Capsule Hotel',
        address: 'Shibuya',
        pricePerNight: 40,
        description: 'Cozy capsule',
      },
    ],
    dailyItinerary: [
      {
        day: 1,
        theme: 'Explore Shibuya',
        activities: [
          {
            time: 'Morning',
            activity: 'Visit Crossing',
            location: 'Shibuya Crossing',
            estimatedCost: 0,
          },
        ],
      },
    ],
    costBreakdown: {
      hotelsTotal: 120,
      activitiesTotal: 0,
      foodAndMiscEstimated: 60,
      grandTotal: 180,
    },
  };

  beforeEach(async () => {
    mockGeminiService = {
      generateItinerary: jest.fn().mockResolvedValue(mockItinerary),
    };
    mockEmailService = {
      sendItineraryEmail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItineraryService,
        { provide: GeminiService, useValue: mockGeminiService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call generateItinerary and sendItineraryEmail', async () => {
    const dto = {
      destination: 'Tokyo',
      days: 3,
      budget: BudgetLevel.BUDGET,
      email: 'user@example.com',
    };

    const result = await service.createItinerary(dto);

    expect(mockGeminiService.generateItinerary).toHaveBeenCalledWith('Tokyo', 3, BudgetLevel.BUDGET);
    expect(mockEmailService.sendItineraryEmail).toHaveBeenCalledWith('user@example.com', mockItinerary);
    expect(result).toEqual(mockItinerary);
  });
});
