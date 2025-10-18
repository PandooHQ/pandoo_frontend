/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProfile } from "../api/getProfile";
import { baseUrl } from "../api/api";

interface Permission {
  subject_class: string;
  actions: string[];
}

interface User {
  id: number;
  email: string;
  position_id: number;
  department_id: number;
  first_name?: string;
  last_name?: string;
  role: string | { name: string };
  position: string | { name: string; id: number };
  department: string | { name: string; id: number };
  status: string;
  created_at: string;
  location: string;
  phone?: string;
  profile_picture: File | string;
  profile_picture_url?: File | string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: Permission[];
  lastVerified: number | null;
  setAuth: (token: string, user?: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  updateUser: (user: Partial<User>) => void;
  fetchProfile: (
    force?: boolean
  ) => Promise<{ success: boolean; authenticated: boolean }>;
  shouldVerifySession: () => boolean;
}

const VERIFY_INTERVAL = 5 * 60 * 1000; // 5 minutos

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: [],
      lastVerified: null,

      setAuth: (token, user) => set({ token, user, lastVerified: Date.now() }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          permissions: [],
          lastVerified: null,
        }),

      isAuthenticated: () => !!get().token && !!get().user,

      shouldVerifySession: () => {
        const { lastVerified } = get();
        if (!lastVerified) return true;
        return Date.now() - lastVerified > VERIFY_INTERVAL;
      },

      updateUser: (user) => {
        const currentUser = get().user;

        const picturePath = user.profile_picture_url || user.profile_picture;
        const profileUrl = picturePath
          ? `${baseUrl.split("/api")[0]}${picturePath}`
          : undefined; // Cambia null a undefined

        const formattedUser: Partial<User> = {
          ...user,
          profile_picture: profileUrl as File | string | undefined, // Cast explícito
          role:
            typeof user.role === "object"
              ? (user.role as any)?.name
              : user.role,
          position:
            typeof user.position === "object"
              ? (user.position as any)?.name
              : user.position || undefined,
          department:
            typeof user.department === "object"
              ? (user.department as any)?.name
              : user.department || undefined,
          position_id:
            user.position_id ||
            (typeof user.position === "object"
              ? (user.position as any)?.id
              : undefined),
          department_id:
            user.department_id ||
            (typeof user.department === "object"
              ? (user.department as any)?.id
              : undefined),
        };

        set({
          user: currentUser ? { ...currentUser, ...formattedUser } : null,
        });
      },

      fetchProfile: async (force = false) => {
        if (!force && !get().shouldVerifySession() && get().user) {
          console.log("Sesión verificada recientemente, usando cache");
          return { success: true, authenticated: true };
        }

        try {
          const resp = await getProfile();
          console.log("Verificando sesión con el servidor", resp);

          if (resp.success && resp.data.authenticated) {
            const { user, permissions } = resp.data;
            const profileUrl =
              `${baseUrl.split("/api")[0]}` + user.profile_picture;
            user.profile_picture = profileUrl;
            console.log("Sesión válida, usuario:", user);
            set({
              user,
              permissions,
              lastVerified: Date.now(),
            });
            return { success: true, authenticated: true };
          } else {
            console.log("Sesión no válida");
            set({ user: null, permissions: [], lastVerified: null });
            return { success: false, authenticated: false };
          }
        } catch (err) {
          console.error("Error al verificar sesión:", err);
          set({ user: null, permissions: [], lastVerified: null });
          return { success: false, authenticated: false };
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
