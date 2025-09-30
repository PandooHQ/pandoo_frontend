import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  name: string
  email: string
  phone?: string
  role?: string
  status?: string
  joinDate?: string | Date
  location?: string
  avatar?: string
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      clearAuth: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token && !!get().user,

      updateUser: (user) => set((state) => ({
        user: state.user ? { ...state.user, ...user } : null,
      })),
    }),
    {
      name: "auth-storage", 
    }
  )
)
