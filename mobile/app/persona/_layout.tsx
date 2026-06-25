import { Redirect, Tabs } from "expo-router";
import { BellRing, Home, LogOut, MapPinned, UserRound, UsersRound } from "lucide-react-native";

import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

export default function PersonaLayout() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <GradientScreen>
        <LoadingView message="Validando sesion..." />
      </GradientScreen>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (user?.role !== "persona") return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800" },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          minHeight: 64,
          paddingBottom: 7,
          paddingTop: 7
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="ubicacion"
        options={{
          title: "Ubicacion",
          tabBarIcon: ({ color, size }) => <MapPinned color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="grupo"
        options={{
          title: "Grupo",
          tabBarIcon: ({ color, size }) => <UsersRound color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, size }) => <BellRing color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Salir",
          tabBarIcon: ({ color, size }) => <LogOut color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
