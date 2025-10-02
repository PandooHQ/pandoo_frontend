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
  first_name?: string;
  last_name?: string;
  role: string;
  position: string;
  department: string;
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
  fetchProfile: (force?: boolean) => Promise<{ success: boolean; authenticated: boolean }>;
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

      clearAuth: () => set({ 
        token: null, 
        user: null, 
        permissions: [], 
        lastVerified: null 
      }),

      isAuthenticated: () => !!get().token && !!get().user,

      shouldVerifySession: () => {
        const { lastVerified } = get();
        if (!lastVerified) return true;
        return Date.now() - lastVerified > VERIFY_INTERVAL;
      },

      updateUser: (user) => {
        const profileUrl = `${baseUrl.split('/api')[0]}` + user.profile_picture_url;
        user.profile_picture = profileUrl;
        console.log(user);
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        }));
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
            const profileUrl = `${baseUrl.split('/api')[0]}` + user.profile_picture;
            user.profile_picture = profileUrl;
            console.log("Sesión válida, usuario:", user);
            set({ 
              user, 
              permissions, 
              lastVerified: Date.now() 
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