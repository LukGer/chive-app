import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Platform, useColorScheme } from "react-native";

import { DatabaseProvider } from "@/components/database-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

function RootLayoutContent() {
  const isIOS = Platform.OS === "ios";
  const bgColor = useThemeColor("background");

  return (
    <>
      {isIOS ? (
        <StatusBar style="auto" />
      ) : (
        <StatusBar style="auto" backgroundColor={bgColor} translucent={false} />
      )}
      <DatabaseProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(authenticated)/(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(unauthenticated)/login/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="admin"
              options={{ headerShown: false, presentation: "formSheet" }}
            />
          </Stack>
        </AuthProvider>
      </DatabaseProvider>
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootLayoutContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
