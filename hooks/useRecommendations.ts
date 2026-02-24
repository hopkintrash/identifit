import { useState, useMemo } from 'react';
import { outfitRecommendations } from '@/data/occasions';
import { OutfitRecommendation, FilterOptions } from '@/types/occasion';

export function useRecommendations() {
  const [filters, setFilters] = useState<FilterOptions>({
    weather: null,
    temperature: null,
    formality: null,
    duration: null,
    timeOfDay: null,
  });

  const filteredRecommendations = useMemo(() => {
    return outfitRecommendations.filter(recommendation => {
      // Weather filter
      if (filters.weather && !recommendation.weatherSuitability.includes(filters.weather)) {
        return false;
      }

      // Temperature filter
      if (filters.temperature) {
        const tempMap = {
          cold: ['snowy', 'windy'],
          mild: ['cloudy', 'rainy'],
          warm: ['sunny'],
          hot: ['hot'],
        };
        const suitableWeather = tempMap[filters.temperature];
        if (!recommendation.weatherSuitability.some(weather => suitableWeather.includes(weather))) {
          return false;
        }
      }

      // Formality filter
      if (filters.formality) {
        const formalityMap = {
          casual: ['casual', 'active'],
          'semi-formal': ['work', 'social'],
          formal: ['formal'],
        };
        
        const suitableOccasions = formalityMap[filters.formality];
        const hasMatchingOccasion = recommendation.occasionTypes.some(occasionId => {
          // Map occasion IDs to categories
          const occasionCategoryMap: Record<string, string> = {
            work: 'work',
            school: 'casual',
            date: 'formal',
            party: 'social',
            casual: 'casual',
            workout: 'active',
            travel: 'casual',
            formal: 'formal',
            outdoor: 'active',
            shopping: 'casual',
          };
          
          const category = occasionCategoryMap[occasionId];
          return suitableOccasions.includes(category);
        });
        
        if (!hasMatchingOccasion) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      weather: null,
      temperature: null,
      formality: null,
      duration: null,
      timeOfDay: null,
    });
  };

  const getRecommendationsForOccasion = (occasionId: string): OutfitRecommendation[] => {
    return outfitRecommendations.filter(rec => 
      rec.occasionTypes.includes(occasionId)
    );
  };

  return {
    filters,
    filteredRecommendations,
    updateFilter,
    clearFilters,
    getRecommendationsForOccasion,
    hasActiveFilters: Object.values(filters).some(value => value !== null),
  };
}