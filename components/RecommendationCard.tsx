import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Heart, Share } from 'lucide-react-native';
import { OutfitRecommendation } from '@/types/occasion';
import { spacing, fontSize, size, radius } from '@/lib/theme';

interface RecommendationCardProps {
  recommendation: OutfitRecommendation;
  onPress?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

export default function RecommendationCard({
  recommendation,
  onPress,
  onLike,
  onShare,
}: RecommendationCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{recommendation.title}</Text>
          <Text style={styles.style}>{recommendation.style}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.actionButton}>
            <Heart size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.actionButton}>
            <Share size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{recommendation.description}</Text>

      {/* Items */}
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Outfit Items:</Text>
        <View style={styles.itemsList}>
          {recommendation.items.map((item, index) => (
            <View key={index} style={styles.itemChip}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Colors */}
      <View style={styles.colorsContainer}>
        <Text style={styles.colorsTitle}>Color Palette:</Text>
        <View style={styles.colorsList}>
          {recommendation.colors.map((color, index) => (
            <View key={index} style={styles.colorChip}>
              <View style={[styles.colorDot, { backgroundColor: getColorHex(color) }]} />
              <Text style={styles.colorText}>{color}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Weather Suitability */}
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>Best for:</Text>
        <View style={styles.weatherList}>
          {recommendation.weatherSuitability.map((weather, index) => (
            <Text key={index} style={styles.weatherTag}>
              {getWeatherIcon(weather)} {capitalizeFirst(weather)}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Navy': '#1e3a8a',
    'White': '#ffffff',
    'Beige': '#f5f5dc',
    'Cream': '#f5f5dc',
    'Denim': '#4682b4',
    'Black': '#000000',
    'Gold': '#ffd700',
    'Burgundy': '#800020',
    'Silver': '#c0c0c0',
    'Gray': '#808080',
    'Khaki': '#c3b091',
    'Charcoal': '#36454f',
    'Brown': '#8b4513',
    'Coral': '#ff7f50',
    'Tan': '#d2b48c',
  };
  return colorMap[colorName] || '#9CA3AF';
}

function getWeatherIcon(weather: string): string {
  const iconMap: Record<string, string> = {
    'sunny': '☀️',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'snowy': '❄️',
    'windy': '💨',
    'hot': '🔥',
  };
  return iconMap[weather] || '🌤️';
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontFamily: 'Caladea-Bold',
    color: '#C0D1FF',
    marginBottom: spacing.xs,
  },
  style: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Medium',
    color: '#A8B3FF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  description: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Regular',
    color: '#D1D5DB',
    lineHeight: spacing.xl,
    marginBottom: spacing.lg,
  },
  itemsContainer: {
    marginBottom: spacing.lg,
  },
  itemsTitle: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  itemChip: {
    backgroundColor: '#3A3A3C',
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  itemText: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#C0D1FF',
  },
  colorsContainer: {
    marginBottom: spacing.lg,
  },
  colorsTitle: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  colorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  colorDot: {
    width: fontSize.xs,
    height: fontSize.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#4A4A4C',
  },
  colorText: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#C0D1FF',
  },
  weatherContainer: {
    marginBottom: spacing.sm,
  },
  weatherTitle: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  weatherList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  weatherTag: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    backgroundColor: '#3A3A3C',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});