import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '../components/SafeScreen';

import { ApolloProvider } from '@apollo/client';
import { client } from '@/utils/graphql/client';
import { useAuthStore } from '@/store/authStore';
import BootingScreen from '@/components/BootingScreen';
import '../utils/i18n';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, role, token, isCheckingAuth } = useAuthStore();

  const [isLayoutReady, setLayoutReady] = useState(false);

  // Step 1: Trigger auth check
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth) {
      setLayoutReady(true);
    } else {
      setLayoutReady(false);
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (!isLayoutReady) return;

    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthScreen) {
      if (role === "admin") router.replace('/(auth)/select-campus');
      if (role === "teacher") router.replace('/(auth)/select-campus');
      if (role === "parent") router.replace('/(auth)/select-profile');
      if (role === "student") router.replace('/(auth)/select-profile');
    }

    SplashScreen.hideAsync(); // 👈 Only hide once layout and auth are ready
  }, [user, token, segments, isLayoutReady]);

  if (!isLayoutReady) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <BootingScreen />
        </SafeScreen>
      </SafeAreaProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabstudent)" />
            <Stack.Screen name="(tabteacher)" />
            <Stack.Screen name="(tabparent)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
