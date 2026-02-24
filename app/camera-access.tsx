import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
} from '@expo-google-fonts/caladea';
import { spacing, fontSize, size, radius, shadow } from '@/lib/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraAccessScreen() {
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);

  const [fontsLoaded] = useFonts({
    Caladea_400Regular,
    Caladea_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleEnableAccess = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status === 'granted' && galleryPermission.status === 'granted') {
        router.push('/(tabs)');
      } else {
        Alert.alert(
          'Camera & Gallery Access',
          'Camera and gallery permissions are needed to upload your daily outfits and track your style.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting camera/gallery permissions:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Allow Camera{'\n'}& Gallery?</Text>
            <Text style={styles.description}>
              We'll use your camera and gallery to upload your daily outfits, track your style, and get personalized recommendations.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enableButton}
            onPress={handleEnableAccess}
            activeOpacity={0.8}
            disabled={isRequesting}
          >
            <Text style={styles.enableButtonText}>
              {isRequesting ? 'Requesting...' : 'Enable Access'}
            </Text>
          </TouchableOpacity>
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
    fontSize: fontSize.base,
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingTop: 180,
    paddingBottom: size.avatarSm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Caladea_400Regular',
    fontSize: fontSize.xxxl,
    lineHeight: 35,
    color: '#C0D1FF',
    marginBottom: spacing.xxl,
  },
  description: {
    fontFamily: 'Helvetica Neue',
    fontSize: fontSize.base,
    lineHeight: 18,
    color: '#B5AFA9',
    maxWidth: 287,
  },
  enableButton: {
    backgroundColor: '#A8B3FF',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.lg,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: shadow.sm,
    shadowOpacity: 0.1,
    shadowRadius: radius.xs,
    elevation: 3,
  },
  enableButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#252525',
  },
});
