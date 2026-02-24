import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
} from '@expo-google-fonts/caladea';
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
} from '@expo-google-fonts/work-sans';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { spacing, fontSize, size, radius, shadow } from '@/lib/theme';

const styleOptions = [
  'Y2K',
  'Casual',
  'Street',
  'Cottage',
  'Sporty',
  'Minimal',
  'Bold',
  'Layering',
  'Grunge',
  'Cozy',
  'Vintage',
  'Cyber',
  'Clean Girl',
  'Coquette',
];

export default function PersonalStyleScreen() {
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [customStyles, setCustomStyles] = useState<string[]>([]);

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
    console.log('Skip pressed');
    router.push('/(tabs)/home');
  };

  const handleContinue = () => {
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Continue pressed with styles:', selectedStyles);
    router.push('/(onboarding)/outfit-prompt');
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSearchSubmit = () => {
    if (
      searchText.trim() &&
      !styleOptions.includes(searchText.trim()) &&
      !customStyles.includes(searchText.trim())
    ) {
      const newStyle = searchText.trim();
      setCustomStyles((prev) => [...prev, newStyle]);
      setSelectedStyles((prev) => [...prev, newStyle]);
      setSearchText('');
    }
  };

  const allStyles = [...styleOptions, ...customStyles];

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

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.6}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Personal Style</Text>
          <Text style={styles.subtitle}>
            This will help us identify your style and offer better outfit
            recommendations.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ex. balletcore"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="done"
          />
        </View>

        <View style={styles.stylesContainer}>
          {allStyles.map((style, index) => (
            <TouchableOpacity
              key={`${style}-${index}`}
              style={[
                styles.styleChip,
                selectedStyles.includes(style) && styles.selectedStyleChip,
              ]}
              onPress={() => toggleStyle(style)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.styleChipText,
                  selectedStyles.includes(style) &&
                    styles.selectedStyleChipText,
                ]}
              >
                {style}
              </Text>
              {selectedStyles.includes(style) && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedStyles.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={selectedStyles.length > 0 ? 0.8 : 1}
          disabled={selectedStyles.length === 0}
        >
          <Text
            style={[
              styles.continueButtonText,
              selectedStyles.length === 0 && styles.continueButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
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
  skipButton: {
    padding: spacing.sm,
  },
  skipButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
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
    color: '#B5AFA9',
    lineHeight: 22,
  },
  searchContainer: {
    marginBottom: spacing.xxxl,
  },
  searchInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A4A4C',
  },
  stylesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  styleChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A4A4C',
    borderRadius: radius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStyleChip: {
    backgroundColor: '#A8B3FF',
    borderColor: '#A8B3FF',
  },
  styleChipText: {
    fontSize: fontSize.sm,
    fontFamily: 'Default',
    color: '#C0D1FF',
  },
  selectedStyleChipText: {
    color: '#000000',
  },
  checkIcon: {
    width: size.iconXs,
    height: size.iconXs,
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: fontSize.xs,
    color: '#000000',
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: shadow.sm,
    shadowOpacity: 0.1,
    shadowRadius: radius.xs,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: fontSize.base,
    color: '#000000',
    letterSpacing: 0.2,
  },
  continueButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
});
