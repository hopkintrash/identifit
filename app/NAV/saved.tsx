import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Bookmark } from 'lucide-react-native';

export default function SavedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Bookmark size={64} color="#8B7CF6" />
        <Text style={styles.title}>Saved Outfits</Text>
        <Text style={styles.subtitle}>Your favorite outfit combinations</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});