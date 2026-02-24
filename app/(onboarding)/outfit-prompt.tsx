import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Caladea_400Regular, Caladea_700Bold } from '@expo-google-fonts/caladea';
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold } from '@expo-google-fonts/work-sans';
import * as Haptics from 'expo-haptics';
import { radius, shadow } from '@/lib/theme';

const { width, height } = Dimensions.get('window');

export default function OutfitUploadScreen() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
    'Caladea-Bold': Caladea_700Bold,
    'WorkSans-Regular': WorkSans_400Regular,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
  });

  const handleContinue = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(tabs)/home');
  };

  const handleSkip = () => {
    router.push('/(tabs)/home');
  };

  if (!fontsLoaded) return null;
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Text Section */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>
            Now, let's try how to{'\n'}
            upload today's <Text style={styles.highlight}>outfit!</Text>
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.6}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.08,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.065, // ~25px on standard phones
    fontFamily: 'Caladea-Regular',
    color: '#C0D1FF',
    textAlign: 'center',
    lineHeight: width * 0.09,
    letterSpacing: 0.3,
  },
  highlight: {
    fontFamily: 'Caladea-Bold',
    color: '#C0D1FF',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#A8B3FF',
    borderRadius: radius.xl,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: shadow.sm,
    shadowOpacity: 0.15,
    shadowRadius: radius.xs,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.3,
  },
  skipButton: {
    paddingVertical: height * 0.015,
  },
  skipButtonText: {
    fontSize: width * 0.038,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
  },
});
