import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import i18n from "../i18n"
import LoginPage from "@/features/login/page"
import { PublicRoute } from "../providers/PublicRoute"
import RegisterPage from "@/features/register/page"
import { PrivateRoute } from "../providers/PrivateRoute"
import DashboardPage from "@/features/dashboard/page"
import { PrivateLayout } from "@/shared/components/PrivateLayout"
import NotFoundPage from "@/shared/components/NotFound"
import SettingsPage from "@/features/settings/page"

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>()

  useEffect(() => {
    if (lang && ["en", "es"].includes(lang)) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  return <>{children}</>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/es/login" replace />} />

        <Route path=":lang">
          <Route
            path="login"
            element={
              <LanguageWrapper>
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              </LanguageWrapper>
            }
          />
          <Route
            path="register"
            element={
              <LanguageWrapper>
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              </LanguageWrapper>
            }
          />

          <Route
            element={
              <LanguageWrapper>
                <PrivateRoute>
                  <PrivateLayout />
                </PrivateRoute>
              </LanguageWrapper>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
