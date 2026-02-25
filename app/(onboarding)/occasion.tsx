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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A4A4C',
  },
  activeDot: {
    backgroundColor: '#A8B3FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Caladea-Regular',
    color: '#C0D1FF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 48,
  },
  textInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A4A4C',
  },
  pastOccasionsContainer: {
    marginBottom: 40,
  },
  pastOccasionsTitle: {
    fontSize: 18,
    fontFamily: 'Caladea-Regular',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  occasionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  occasionChip: {
    backgroundColor: '#4A4A4C',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 4,
  },
  selectedOccasionChip: {
    backgroundColor: '#A8B3FF',
  },
  occasionChipText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Medium',
    color: '#C0D1FF',
  },
  selectedOccasionChipText: {
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#A8B3FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
  },
});