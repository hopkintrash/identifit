import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Camera, Image as ImageIcon, Shield } from 'lucide-react-native';
import { spacing, fontSize, size, radius, shadow } from '@/lib/theme';

interface PermissionLoadingScreenProps {
  type: 'camera' | 'gallery' | 'both';
  message?: string;
}

export default function PermissionLoadingScreen({
  type,
  message,
}: PermissionLoadingScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation for shield
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const getContent = () => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera size={56} color="#A8B3FF" strokeWidth={1.5} />,
          title: 'Requesting Camera Access',
          subtitle: message || 'Please allow camera access to take outfit photos',
        };
      case 'gallery':
        return {
          icon: <ImageIcon size={56} color="#A8B3FF" strokeWidth={1.5} />,
          title: 'Requesting Gallery Access',
          subtitle: message || 'Please allow gallery access to upload photos',
        };
      case 'both':
        return {
          icon: (
            <View style={styles.dualIconContainer}>
              <Camera size={42} color="#A8B3FF" strokeWidth={1.5} />
              <ImageIcon size={42} color="#A8B3FF" strokeWidth={1.5} />
            </View>
          ),
          title: 'Requesting Permissions',
          subtitle: message || 'Please allow camera and gallery access',
        };
    }
  };

  const content = getContent();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Security Shield */}
        <View style={styles.securityContainer}>
          <Animated.View style={[styles.securityShield, { transform: [{ rotate: spin }] }]}>
            <Shield size={20} color="#4ADE80" />
          </Animated.View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Animated Icon */}
          <Animated.View style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            {content.icon}
          </Animated.View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.subtitle}>{content.subtitle}</Text>
          </View>

          {/* Loading Dots */}
          <View style={styles.loadingContainer}>
            <LoadingDots />
          </View>

          {/* Privacy Assurance */}
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyText}>
              🔒 Your privacy is protected. Photos are processed locally on your device.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDots = () => {
      const createDotAnimation = (dot: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );

      Animated.parallel([
        createDotAnimation(dot1, 0),
        createDotAnimation(dot2, 200),
        createDotAnimation(dot3, 400),
      ]).start();
    };

    animateDots();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  securityContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  securityShield: {
    width: size.touch,
    height: size.touch,
    borderRadius: radius.round,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: size.avatarXXl + spacing.xxl,
    height: size.avatarXXl + spacing.xxl,
    borderRadius: size.avatarSm,
    backgroundColor: 'rgba(168, 179, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    borderWidth: 2,
    borderColor: 'rgba(168, 179, 255, 0.2)',
  },
  dualIconContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: size.touch,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.lg,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  loadingContainer: {
    marginBottom: size.touch,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.xs,
    backgroundColor: '#A8B3FF',
  },
  privacyContainer: {
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.1)',
    marginBottom: spacing.xl,
  },
  privacyText: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: spacing.xl,
  },
  buttonContainer: {
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  settingsButton: {
    backgroundColor: '#A8B3FF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#A8B3FF',
    shadowOffset: shadow.md,
    shadowOpacity: 0.3,
    shadowRadius: spacing.sm,
    elevation: 8,
  },
  settingsButtonText: {
    fontSize: fontSize.md,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  retryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#4A4A4C',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Medium',
    color: '#C0D1FF',
  },
  skipButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'WorkSans-Regular',
    color: '#6B7280',
  },
});