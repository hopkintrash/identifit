import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { X, Filter } from 'lucide-react-native';
import { FilterOptions } from '@/types/occasion';
import { weatherConditions } from '@/data/occasions';
import { spacing, fontSize, size, radius } from '@/lib/theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onUpdateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  onClearFilters: () => void;
}

export default function FilterSheet({
  visible,
  onClose,
  filters,
  onUpdateFilter,
  onClearFilters,
}: FilterSheetProps) {
  const temperatureOptions = [
    { id: 'cold', name: 'Cold', range: '< 50°F', icon: '🧊' },
    { id: 'mild', name: 'Mild', range: '50-70°F', icon: '🌤️' },
    { id: 'warm', name: 'Warm', range: '70-80°F', icon: '☀️' },
    { id: 'hot', name: 'Hot', range: '> 80°F', icon: '🔥' },
  ];

  const formalityOptions = [
    { id: 'casual', name: 'Casual', description: 'Relaxed, everyday wear' },
    { id: 'semi-formal', name: 'Semi-Formal', description: 'Business casual, smart casual' },
    { id: 'formal', name: 'Formal', description: 'Dressy, elegant occasions' },
  ];

  const durationOptions = [
    { id: 'short', name: 'Short', description: '1-3 hours' },
    { id: 'medium', name: 'Medium', description: '3-6 hours' },
    { id: 'long', name: 'Long', description: '6+ hours' },
  ];

  const timeOfDayOptions = [
    { id: 'morning', name: 'Morning', description: '6AM - 12PM' },
    { id: 'afternoon', name: 'Afternoon', description: '12PM - 6PM' },
    { id: 'evening', name: 'Evening', description: '6PM - 10PM' },
    { id: 'night', name: 'Night', description: '10PM+' },
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Filter size={24} color="#C0D1FF" />
            <Text style={styles.headerTitle}>Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Weather Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weather</Text>
            <View style={styles.optionsGrid}>
              {weatherConditions.map((weather) => (
                <TouchableOpacity
                  key={weather.id}
                  style={[
                    styles.weatherOption,
                    filters.weather === weather.id && styles.selectedOption,
                  ]}
                  onPress={() => onUpdateFilter('weather', 
                    filters.weather === weather.id ? null : weather.id
                  )}
                >
                  <Text style={styles.weatherIcon}>{weather.icon}</Text>
                  <Text style={[
                    styles.optionText,
                    filters.weather === weather.id && styles.selectedOptionText,
                  ]}>
                    {weather.name}
                  </Text>
                  <Text style={[
                    styles.temperatureText,
                    filters.weather === weather.id && styles.selectedTemperatureText,
                  ]}>
                    {weather.temperature}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperature Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temperature Range</Text>
            <View style={styles.optionsRow}>
              {temperatureOptions.map((temp) => (
                <TouchableOpacity
                  key={temp.id}
                  style={[
                    styles.tempOption,
                    filters.temperature === temp.id && styles.selectedOption,
                  ]}
                  onPress={() => onUpdateFilter('temperature', 
                    filters.temperature === temp.id ? null : temp.id as any
                  )}
                >
                  <Text style={styles.tempIcon}>{temp.icon}</Text>
                  <Text style={[
                    styles.optionText,
                    filters.temperature === temp.id && styles.selectedOptionText,
                  ]}>
                    {temp.name}
                  </Text>
                  <Text style={[
                    styles.rangeText,
                    filters.temperature === temp.id && styles.selectedRangeText,
                  ]}>
                    {temp.range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Formality Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dress Code</Text>
            <View style={styles.optionsColumn}>
              {formalityOptions.map((formality) => (
                <TouchableOpacity
                  key={formality.id}
                  style={[
                    styles.formalityOption,
                    filters.formality === formality.id && styles.selectedOption,
                  ]}
                  onPress={() => onUpdateFilter('formality', 
                    filters.formality === formality.id ? null : formality.id as any
                  )}
                >
                  <Text style={[
                    styles.optionTitle,
                    filters.formality === formality.id && styles.selectedOptionText,
                  ]}>
                    {formality.name}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    filters.formality === formality.id && styles.selectedDescriptionText,
                  ]}>
                    {formality.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Duration</Text>
            <View style={styles.optionsRow}>
              {durationOptions.map((duration) => (
                <TouchableOpacity
                  key={duration.id}
                  style={[
                    styles.durationOption,
                    filters.duration === duration.id && styles.selectedOption,
                  ]}
                  onPress={() => onUpdateFilter('duration', 
                    filters.duration === duration.id ? null : duration.id as any
                  )}
                >
                  <Text style={[
                    styles.optionText,
                    filters.duration === duration.id && styles.selectedOptionText,
                  ]}>
                    {duration.name}
                  </Text>
                  <Text style={[
                    styles.durationDescription,
                    filters.duration === duration.id && styles.selectedDescriptionText,
                  ]}>
                    {duration.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time of Day Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time of Day</Text>
            <View style={styles.optionsRow}>
              {timeOfDayOptions.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeOption,
                    filters.timeOfDay === time.id && styles.selectedOption,
                  ]}
                  onPress={() => onUpdateFilter('timeOfDay', 
                    filters.timeOfDay === time.id ? null : time.id as any
                  )}
                >
                  <Text style={[
                    styles.optionText,
                    filters.timeOfDay === time.id && styles.selectedOptionText,
                  ]}>
                    {time.name}
                  </Text>
                  <Text style={[
                    styles.timeDescription,
                    filters.timeOfDay === time.id && styles.selectedDescriptionText,
                  ]}>
                    {time.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.applyButton}
            onPress={onClose}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontFamily: 'Caladea-Bold',
    color: '#C0D1FF',
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxxl,
    paddingTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontFamily: 'Caladea-Regular',
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  optionsColumn: {
    gap: spacing.lg,
  },
  weatherOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    minWidth: size.filterTile,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  tempOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    minWidth: size.avatarLg,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  formalityOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  durationOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  timeOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  selectedOption: {
    backgroundColor: '#A8B3FF',
    borderColor: '#A8B3FF',
  },
  weatherIcon: {
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
  },
  tempIcon: {
    fontSize: fontSize.lg,
    marginBottom: spacing.sm,
  },
  optionText: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Medium',
    color: '#C0D1FF',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#000000',
  },
  optionTitle: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-SemiBold',
    color: '#C0D1FF',
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    lineHeight: spacing.lg,
  },
  selectedDescriptionText: {
    color: '#4A4A4C',
  },
  temperatureText: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },
  selectedTemperatureText: {
    color: '#4A4A4C',
  },
  rangeText: {
    fontSize: fontSize.caption,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },
  selectedRangeText: {
    color: '#4A4A4C',
  },
  durationDescription: {
    fontSize: fontSize.caption,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },
  timeDescription: {
    fontSize: fontSize.caption,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A4A4C',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Medium',
    color: '#9CA3AF',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#A8B3FF',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
  },
});