export interface Hotel {
  name: string;
  address: string;
  pricePerNight: number;
  description: string;
}

export interface Activity {
  time: 'Morning' | 'Afternoon' | 'Evening';
  activity: string;
  location: string;
  estimatedCost: number;
}

export interface DailyPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface CostBreakdown {
  hotelsTotal: number;
  activitiesTotal: number;
  foodAndMiscEstimated: number;
  grandTotal: number;
}

export interface ItineraryResponse {
  destination: string;
  days: number;
  budget: string;
  hotels: Hotel[];
  dailyItinerary: DailyPlan[];
  costBreakdown: CostBreakdown;
}
