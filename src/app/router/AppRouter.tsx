import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import i18n from "../i18n"
import LoginPage from "@/features/login/page"
import { PublicRoute } from "../providers/PublicRoute"
import RegisterPage from "@/features/register/page"
import { PrivateRoute } from "../providers/PrivateRoute"
import { PrivateLayout } from "@/shared/components/PrivateLayout"
import NotFoundPage from "@/shared/components/NotFound"
import SettingsPage from "@/features/settings/page"
import HomePage from "@/features/home/page"
import FormPage from "@/features/forms/page"
import FormBuilderPage from "@/features/formBuilder/page"
import MobileFormsPage from "@/features/mobileForms/page"
import FormEntryPage from "@/features/formEntry/page"
import FormDataPage from "@/features/data/page"
import RolesPage from "@/features/roles/page"
import EditRolePage from "@/features/roles/edit/page"
import ManageUsersPage from "@/features/roles/manageUsers/page"
import ConfigureRolePage from "@/features/roles/configure/page"
import PersonnelManagementPage from "@/features/personnel/page"
import FormBuilderEditPage from "@/features/formBuilder/pageEdit"
import BulkFormAssignmentPage from "@/features/forms/assignment/page"
import FillForm from "@/features/formEntry/fillForm/page"
import CompleteForm from "@/features/mobileForms/completeForm/page"

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
            <Route path="settings" element={<SettingsPage />} />
            <Route path="personnel" element={<PersonnelManagementPage />} />
           
            <Route path="roles" element={<RolesPage />} />
            <Route path="roles/edit/:id" element={<EditRolePage />} />
            <Route path="roles/manage-users/:id" element={<ManageUsersPage />} />
            <Route path="roles/configure/:name" element={<ConfigureRolePage />} />


            <Route path="forms" element={<FormPage />} />
            <Route path="forms/blank" element={<FormBuilderPage/>} />

            <Route path="forms/form-entry" element={<FormEntryPage/>} />
            <Route path="forms/form-entry/:id" element={<FillForm/>} />
            
            <Route path="forms/mobile-forms" element={<MobileFormsPage/>} />
            <Route path="forms/mobile-forms/:id" element={<CompleteForm/>} />

            <Route path="forms/data" element={<FormDataPage/>}/>
            <Route path="forms/edit/:id" element={<FormBuilderEditPage/>} />
            <Route path="forms/bulk-assignment" element={<BulkFormAssignmentPage/>} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
