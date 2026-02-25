import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { Camera, Image as ImageIcon, Shield, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PermissionScreenProps {
  type: 'camera' | 'gallery' | 'both';
  onAllow: () => void;
  onDeny?: () => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
}

export default function PermissionScreen({
  type,
  onAllow,
  onDeny,
  onSkip,
  title,
  subtitle,
}: PermissionScreenProps) {
  const getPermissionContent = () => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera size={64} color="#A8B3FF" strokeWidth={1.5} />,
          title: title || 'Camera Access',
          subtitle: subtitle || 'Take photos of your outfits to track your style and get personalized recommendations.',
          benefits: [
            'Capture your daily outfits',
            'Build your style profile',
            'Get AI-powered recommendations',
          ],
        };
      case 'gallery':
        return {
          icon: <ImageIcon size={64} color="#A8B3FF" strokeWidth={1.5} />,
          title: title || 'Photo Gallery Access',
          subtitle: subtitle || 'Access your photos to upload existing outfit pictures and build your style collection.',
          benefits: [
            'Upload existing outfit photos',
            'Import your style history',
            'Organize your wardrobe digitally',
          ],
        };
      case 'both':
        return {
          icon: (
            <View style={styles.dualIconContainer}>
              <Camera size={48} color="#A8B3FF" strokeWidth={1.5} />
              <ImageIcon size={48} color="#A8B3FF" strokeWidth={1.5} />
            </View>
          ),
          title: title || 'Camera & Gallery Access',
          subtitle: subtitle || 'Take new photos and access existing ones to build your complete style profile.',
          benefits: [
            'Take photos of daily outfits',
            'Upload existing style photos',
            'Get personalized recommendations',
            'Track your style evolution',
          ],
        };
    }
  };

  const content = getPermissionContent();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Security Badge */}
        <View style={styles.securityHeader}>
          <View style={styles.securityBadge}>
            <Shield size={16} color="#4ADE80" />
            <Text style={styles.securityText}>Secure & Private</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            {content.icon}
          </View>

          {/* Title and Subtitle */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.subtitle}>{content.subtitle}</Text>
          </View>

          {/* Benefits List */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>What this enables:</Text>
            {content.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              Your photos stay on your device. We only analyze them locally to provide style insights.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.8}
          >
            <Text style={styles.allowButtonText}>Allow Access</Text>
            <ChevronRight size={20} color="#000000" />
          </TouchableOpacity>

          {onDeny && (
            <TouchableOpacity
              style={styles.denyButton}
              onPress={onDeny}
              activeOpacity={0.6}
            >
              <Text style={styles.denyButtonText}>Not Now</Text>
            </TouchableOpacity>
          )}

          {onSkip && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
              activeOpacity={0.6}
            >
              <Text style={styles.skipButtonText}>Skip Setup</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
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
    paddingTop: 20,
  },
  securityHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
    color: '#4ADE80',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 179, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(168, 179, 255, 0.2)',
  },
  dualIconContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: '#C0D1FF',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A8B3FF',
    marginRight: 16,
  },
  benefitText: {
    fontSize: 15,
    fontFamily: 'WorkSans-Regular',
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 22,
  },
  privacyNote: {
    backgroundColor: 'rgba(168, 179, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 179, 255, 0.1)',
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 13,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingBottom: 34,
    gap: 12,
  },
  allowButton: {
    backgroundColor: '#A8B3FF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#A8B3FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  allowButtonText: {
    fontSize: 17,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  denyButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4A4C',
    alignItems: 'center',
  },
  denyButtonText: {
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    color: '#9CA3AF',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontFamily: 'WorkSans-Regular',
    color: '#6B7280',
  },
});