import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
} from '@expo-google-fonts/caladea';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeatureOverview() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
    'Caladea-Bold': Caladea_700Bold,
  });

  const galleryImages = [
    require('@/assets/images/Frame 121075726.png'),
    require('@/assets/images/Frame 121075729.png'),
    require('@/assets/images/Frame 121075728.png'),
  ];

  useEffect(() => {
    if (currentSlide === 1) {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, galleryImages.length]);

  if (!fontsLoaded) {
    return null;
  }

  const slides = [
    {
      title: 'Track Your Style',
      description:
        "Upload your daily outfits (OOTD) to discover your style trends and see how much of your wardrobe you're actually using.",
      image: require('@/assets/images/Track_your_style.png'),
    },
    {
      title: 'Personalized Outfit Suggestions',
      description:
        'Get personalized outfit suggestions based on your preferences, weather, events, and the clothes you own.',
    },
    {
      title: 'Recreate Inspirations',
      description:
        'Find similar pieces in your wardrobe to recreate outfit inspirations you love from social media and fashion magazines.',
      image: require('@/assets/images/Group 121075721.png'),
    },
    {
      title: 'Monthly Style Recap',
      description:
        'Review your style journey with monthly recaps showing your most-worn pieces, color preferences, and style evolution.',
      image: require('@/assets/images/Group 121075722.png'),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/(onboarding)');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {currentSlide === 0 && slides[0].image && (
          <View style={styles.imageContainer}>
            <Image
              source={slides[0].image}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </View>
        )}

        {currentSlide === 1 && (
          <View style={styles.imageContainer}>
            <View style={styles.galleryContainer}>
              {galleryImages.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={[
                    styles.galleryImage,
                    {
                      opacity: index === galleryIndex ? 1 : 0,
                    },
                  ]}
                  resizeMode="contain"
                />
              ))}
            </View>
          </View>
        )}

        {currentSlide === 2 && slides[2].image && (
          <View style={styles.imageContainer}>
            <Image
              source={slides[2].image}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </View>
        )}

        {currentSlide === 3 && slides[3].image && (
          <View style={styles.imageContainer}>
            <Image
              source={slides[3].image}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{slides[currentSlide].title}</Text>
            <Text style={styles.description}>
              {slides[currentSlide].description}
            </Text>
          </View>

          <View style={styles.navigationContainer}>
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentSlide
                      ? styles.dotActive
                      : styles.dotInactive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleNext}
              style={styles.nextButton}
              activeOpacity={0.8}
            >
              <ArrowRight size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: Math.min(393, SCREEN_WIDTH),
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 29,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
  },
  imageContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: 300,
    height: 300,
  },
  galleryContainer: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 60,
    left: 29,
    right: 29,
  },
  textContent: {
    marginBottom: 60,
  },
  title: {
    fontFamily: 'Caladea-Regular',
    fontSize: 32,
    lineHeight: 38,
    color: '#C0D1FF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#B5AFA9',
    maxWidth: 335,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 32,
    backgroundColor: '#C0D1FF',
  },
  dotInactive: {
    width: 4,
    backgroundColor: 'rgba(192, 209, 255, 0.3)',
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C0D1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
