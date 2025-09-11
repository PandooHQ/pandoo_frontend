// routes/PublicRoute.tsx
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { useAuthStore } from "@/shared/stores/auth";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { token } = useAuthStore();
  const { lang } = useParams<{ lang: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  if (token) return <Navigate to={`/${lang ?? "es"}/`} replace />;

  return <>{children}</>;
}
