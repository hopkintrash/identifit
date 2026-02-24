export interface WeatherCondition {
  id: string;
  name: string;
  icon: string;
  temperature?: string;
}

export interface OccasionType {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'casual' | 'formal' | 'active' | 'social' | 'work';
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  items: string[];
  colors: string[];
  style: string;
  weatherSuitability: string[];
  occasionTypes: string[];
  image?: string;
}

export interface FilterOptions {
  weather: string | null;
  temperature: 'cold' | 'mild' | 'warm' | 'hot' | null;
  formality: 'casual' | 'semi-formal' | 'formal' | null;
  duration: 'short' | 'medium' | 'long' | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | null;
}