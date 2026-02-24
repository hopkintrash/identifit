import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { House } from 'lucide-react-native';
import { spacing, fontSize } from '@/lib/theme';

export default function LinksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <House size={64} color="#8B7CF6" />
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Your style dashboard</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});