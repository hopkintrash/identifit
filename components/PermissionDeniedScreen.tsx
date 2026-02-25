import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Camera, Image as ImageIcon, Settings, CircleAlert as AlertCircle } from 'lucide-react-native';

interface PermissionDeniedScreenProps {
  type: 'camera' | 'gallery' | 'both';
  onRetry: () => void;
  onSkip?: () => void;
  onOpenSettings?: () => void;
}

export default function PermissionDeniedScreen({
  type,
  onRetry,
  onSkip,
  onOpenSettings,
}: PermissionDeniedScreenProps) {
  const getContent = () => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera size={56} color="#EF4444" strokeWidth={1.5} />,
          title: 'Camera Access Denied',
          subtitle: 'To take outfit photos, we need access to your camera.',
          instructions: [
            'Go to Settings > Privacy & Security > Camera',
            'Find this app and toggle it on',
            'Return to the app and try again',
          ],
        };
      case 'gallery':
        return {
          icon: <ImageIcon size={56} color="#EF4444" strokeWidth={1.5} />,
          title: 'Gallery Access Denied',
          subtitle: 'To upload existing photos, we need access to your photo library.',
          instructions: [
            'Go to Settings > Privacy & Security > Photos',
            'Find this app and select "All Photos"',
            'Return to the app and try again',
          ],
        };
      case 'both':
        return {
          icon: (
            <View style={styles.dualIconContainer}>
              <Camera size={40} color="#EF4444" strokeWidth={1.5} />
              <ImageIcon size={40} color="#EF4444" strokeWidth={1.5} />
            </View>
          ),
          title: 'Camera & Gallery Access Denied',
          subtitle: 'To use all outfit features, we need access to your camera and photo library.',
          instructions: [
            'Go to Settings > Privacy & Security',
            'Enable Camera and Photos access for this app',
            'Return to the app and try again',
          ],
        };
    }
  };

  const content = getContent();

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
      if (onOpenSettings) {
        onOpenSettings();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Warning Header */}
        <View style={styles.warningHeader}>
          <View style={styles.warningBadge}>
            <AlertCircle size={16} color="#F59E0B" />
            <Text style={styles.warningText}>Permission Required</Text>
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

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How to enable:</Text>
            {content.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleOpenSettings}
            activeOpacity={0.8}
          >
            <Settings size={20} color="#000000" />
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>

          {onSkip && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
              activeOpacity={0.6}
            >
              <Text style={styles.skipButtonText}>Continue Without Access</Text>
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
  warningHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
    color: '#F59E0B',
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.2)',
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
    fontSize: 26,
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
  instructionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: '#C0D1FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A8B3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'WorkSans-Bold',
    color: '#000000',
  },
  instructionText: {
    fontSize: 15,
    fontFamily: 'WorkSans-Regular',
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingBottom: 34,
    gap: 12,
  },
  settingsButton: {
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
  settingsButtonText: {
    fontSize: 17,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  retryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A4A4C',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
    color: '#C0D1FF',
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