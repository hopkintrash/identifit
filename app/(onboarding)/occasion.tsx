import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFonts, Caladea_400Regular, Caladea_700Bold } from '@expo-google-fonts/caladea';
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold } from '@expo-google-fonts/work-sans';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { spacing, fontSize, size, radius, shadow } from '@/lib/theme';

const pastOccasions = [
  'Y2K House Party',
  'School',
  'Formal',
  'Picnic',
  'Date',
];

export default function OccasionScreen() {
  const router = useRouter();
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [currentOccasion, setCurrentOccasion] = useState('');
  
  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
    'Caladea-Bold': Caladea_700Bold,
    'WorkSans-Regular': WorkSans_400Regular,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.push('/(tabs)/home');
  };

  const handleContinue = () => {
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Continue pressed with occasion:', currentOccasion);
    router.push('/(onboarding)/upload-outfit');
  };

  const togglePastOccasion = (occasion: string) => {
    setSelectedOccasions(prev => 
      prev.includes(occasion) 
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
    setCurrentOccasion(occasion);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.6}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.progressIndicator}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Occasion</Text>
          <Text style={styles.subtitle}>
            Please specify any activities or locations planned for today.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="ex. school"
            placeholderTextColor="#6B7280"
            value={currentOccasion}
            onChangeText={setCurrentOccasion}
            returnKeyType="done"
          />
        </View>

        <View style={styles.pastOccasionsContainer}>
          <Text style={styles.pastOccasionsTitle}>Past Occasions</Text>
          
          <View style={styles.occasionsGrid}>
            {pastOccasions.map((occasion) => (
              <TouchableOpacity
                key={occasion}
                style={[
                  styles.occasionChip,
                  selectedOccasions.includes(occasion) && styles.selectedOccasionChip,
                ]}
                onPress={() => togglePastOccasion(occasion)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.occasionChipText,
                  selectedOccasions.includes(occasion) && styles.selectedOccasionChipText,
                ]}>
                  {occasion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.6}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.xs,
    backgroundColor: '#4A4A4C',
  },
  activeDot: {
    backgroundColor: '#A8B3FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  titleContainer: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: 'Caladea-Regular',
    color: '#C0D1FF',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: fontSize.base,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: size.touchLg,
  },
  textInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A4A4C',
  },
  pastOccasionsContainer: {
    marginBottom: size.touch,
  },
  pastOccasionsTitle: {
    fontSize: fontSize.md,
    fontFamily: 'Caladea-Regular',
    color: '#FFFFFF',
    marginBottom: spacing.xl,
  },
  occasionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  occasionChip: {
    backgroundColor: '#4A4A4C',
    borderRadius: radius.round,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xs,
  },
  selectedOccasionChip: {
    backgroundColor: '#A8B3FF',
  },
  occasionChipText: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Medium',
    color: '#C0D1FF',
  },
  selectedOccasionChipText: {
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  continueButton: {
    backgroundColor: '#A8B3FF',
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: shadow.sm,
    shadowOpacity: 0.1,
    shadowRadius: radius.xs,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  skipButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
  },
});