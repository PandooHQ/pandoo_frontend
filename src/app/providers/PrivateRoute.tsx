import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { useAuthStore } from "@/shared/stores/auth";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token, user, fetchProfile, clearAuth, shouldVerifySession } = useAuthStore();
  const { lang } = useParams<{ lang: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (!user || shouldVerifySession()) {
        console.log("Verificando sesión con el servidor...");
        try {
          const result = await fetchProfile();
          
          if (!result.authenticated) {
            console.log("Sesión expirada, limpiando autenticación");
            clearAuth();
          }
        } catch (e) {
          console.error("Error al verificar sesión:", e);
          clearAuth();
        }
      } else {
        console.log("Sesión válida en cache, no es necesario verificar");
      }
      
      setLoading(false);
    };
    
    checkProfile();
  }, [token, user, fetchProfile, clearAuth, shouldVerifySession]);

  if (loading) return <LoadingScreen />;

  if (!token || !user) {
    return <Navigate to={`/${lang ?? "es"}/login`} replace />;
  }

  return <>{children}</>;
}