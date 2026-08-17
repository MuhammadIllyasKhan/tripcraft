export interface Activity {
  time: string; // e.g., 'Morning', 'Afternoon', 'Evening'
  activity: string;
  location: string;
  estimatedCost: number;
}

export interface HotelInfo {
  name: string;
  address: string;
  pricePerNight: number;
  description: string;
}

export interface CostBreakdown {
  hotelsTotal: number;
  activitiesTotal: number;
  foodAndMiscEstimated: number;
  grandTotal: number;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface ItineraryResponse {
  destination: string;
  days: number;
  budget: string;
  hotels: HotelInfo[];
  dailyItinerary: DayPlan[];
  costBreakdown: CostBreakdown;
}
