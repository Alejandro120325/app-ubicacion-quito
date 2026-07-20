import { Redirect, Tabs } from "expo-router";
import { BellRing, Headphones, LayoutDashboard, LogOut, MapPinned, ScrollText, UserRound, UsersRound } from "lucide-react-native";

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
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          borderTopColor: colors.glassBorder,
          borderTopWidth: 1,
          boxShadow: "0 -16px 36px rgba(0, 0, 0, 0.28)",
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
          title: "Pers.",
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
        name="bitacora"
        options={{
          title: "Bita.",
          tabBarIcon: ({ color, size }) => <ScrollText color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="api"
        options={{
          href: null
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
        name="soporte"
        options={{
          title: "Sop.",
          tabBarIcon: ({ color, size }) => <Headphones color={color} size={size} />
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
