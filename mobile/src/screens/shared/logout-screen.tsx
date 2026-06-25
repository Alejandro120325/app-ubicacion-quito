import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { GradientScreen } from "@/components/gradient-screen";
import { LoadingView } from "@/components/loading-view";
import { useAuth } from "@/context/auth-context";

export function LogoutScreen() {
  const { logout } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    logout().finally(() => setDone(true));
  }, [logout]);

  if (done) return <Redirect href="/login" />;

  return (
    <GradientScreen>
      <LoadingView message="Cerrando sesion..." />
    </GradientScreen>
  );
}
