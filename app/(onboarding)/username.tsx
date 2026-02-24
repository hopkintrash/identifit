import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Caladea_400Regular,
} from '@expo-google-fonts/caladea';
import * as Haptics from 'expo-haptics';
import { saveUsername } from '@/lib/username';
import { spacing, fontSize, size, radius, shadow } from '@/lib/theme';

export default function UsernameScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
  });

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleContinue = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsLoading(true);
    setError(null);

    const tempUserId = generateUUID();

    const result = await saveUsername(tempUserId, username.trim());

    if (result.success) {
      router.push('/(onboarding)/index');
    } else {
      setError(result.error || 'Failed to save username');
      if (Platform.OS === 'web') {
        Alert.alert('Error', result.error || 'Failed to save username');
      }
    }

    setIsLoading(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.inputSection}>
            <Text style={styles.title}>Create your username</Text>

            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder=""
              placeholderTextColor="#666666"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              selectionColor="#FFFFFF"
            />

            <Text style={styles.helperText}>
              Your username is unique.{'\n'}
              You can always change it later.
            </Text>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (username.length === 0 || isLoading) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={username.length === 0 || isLoading}
          >
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingTop: 120,
    paddingBottom: size.touch,
  },
  inputSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Caladea-Regular',
    color: '#C0D1FF',
    textAlign: 'center',
    marginBottom: size.touch,
    letterSpacing: 0.3,
  },
  input: {
    fontSize: fontSize.xl,
    fontFamily: 'Caladea-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxxl,
    width: '100%',
  },
  helperText: {
    fontSize: fontSize.sm,
    color: '#999999',
    textAlign: 'center',
    lineHeight: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  continueButton: {
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
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.2,
  },
});
