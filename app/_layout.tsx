import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

import BootingScreen from "@/components/BootingScreen";
import { useAuthStore } from "@/store/authStore";
import { client } from "@/utils/graphql/client";
import { ApolloProvider } from "@apollo/client";
import "../utils/i18n";

// 👇 Prevent the splash screen from auto-hiding until ready
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

  // Step 2: Update layout readiness
  useEffect(() => {
    setLayoutReady(!isCheckingAuth);
  }, [isCheckingAuth]);

  // Step 3: Handle routing logic once layout and auth are ready
  useEffect(() => {
    if (!isLayoutReady) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      if (role === "admin") router.replace("/(auth)/select-campus");
      if (role === "teacher") router.replace("/(auth)/select-campus");
      if (role === "parent") router.replace("/(auth)/select-profile");
      if (role === "student") router.replace("/(auth)/select-profile");
    }

    SplashScreen.hideAsync();
  }, [user, token, segments, isLayoutReady]);

  // ✅ Step 4: Register the PWA service worker (Web Only)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "%c[PWA]",
              "color: #2D7A7A; font-weight: bold;",
              "Service Worker registered successfully:",
              registration.scope
            );
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });
    }
  }, []);

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
