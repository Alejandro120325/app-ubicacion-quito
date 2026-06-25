import { Redirect, Tabs } from "expo-router";
import { AlertTriangle, BellRing, Code2, LayoutDashboard, LogOut, MapPinned, UsersRound } from "lucide-react-native";

import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

export default function AdminLayout() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <GradientScreen>
        <LoadingView message="Validando sesion..." />
      </GradientScreen>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (user?.role !== "admin") return <Redirect href="/" />;

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
          title: "Home",
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="personas"
        options={{
          title: "Personas",
          tabBarIcon: ({ color, size }) => <UsersRound color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="grupos"
        options={{
          title: "Grupos",
          tabBarIcon: ({ color, size }) => <UsersRound color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => <MapPinned color={color} size={size} />
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
        name="api"
        options={{
          title: "API",
          tabBarIcon: ({ color, size }) => <Code2 color={color} size={size} />
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
