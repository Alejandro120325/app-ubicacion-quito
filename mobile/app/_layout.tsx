import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/auth-context";
import { colors } from "@/constants/theme";
import { SecurityGate } from "@/components/security-gate";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <SecurityGate />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="persona" />
      </Stack>
    </AuthProvider>
  );
}
