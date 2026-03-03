import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 350,
        contentStyle: { backgroundColor: '#252525' },
      }}>
      <Stack.Screen name="username" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="body-type" options={{ headerShown: false }} />
      <Stack.Screen name="personal-style" options={{ headerShown: false }} />
    </Stack>
  );
}