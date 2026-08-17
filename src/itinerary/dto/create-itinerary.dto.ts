import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export enum BudgetLevel {
  BUDGET = 'Budget',
  MODERATE = 'Moderate',
  LUXURY = 'Luxury',
}

export class CreateItineraryDto {
  @ApiProperty({
    description: 'The destination of the trip',
    example: 'Paris, France',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    description: 'Number of days for the itinerary (between 1 and 30)',
    example: 5,
    minimum: 1,
    maximum: 30,
  })
  @IsInt()
  @Min(1)
  @Max(30)
  days: number;

  @ApiProperty({
    description: 'The budget category for the trip',
    enum: BudgetLevel,
    example: BudgetLevel.BUDGET,
  })
  @IsEnum(BudgetLevel)
  budget: BudgetLevel;

  @ApiProperty({
    description: 'The email address to receive the completed itinerary',
    example: 'traveler@example.com',
  })
  @IsEmail()
  email: string;
}
