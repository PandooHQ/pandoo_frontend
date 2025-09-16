import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom"
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
import HomePage from "@/features/home/page"
import FormPage from "@/features/forms/page"
import FormBuilderPage from "@/features/formBuilder/page"
import FormBuilderEditPage from "@/features/formBuilder/pageEdit"

const SUPPORTED_LANGUAGES = ["en", "es"]
const DEFAULT_LANGUAGE = "es"

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
      navigate(`/${DEFAULT_LANGUAGE}${window.location.pathname.replace(/^\/[^/]*/, '')}`, { replace: true })
      return
    }

    if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang)
    }
  }, [lang, navigate])

  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
    return null
  }

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
            <Route path="" element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="forms" element={<FormPage />} />
            <Route path="forms/blank" element={<FormBuilderPage/>} />
            <Route path="forms/edit/:id" element={<FormBuilderEditPage/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
