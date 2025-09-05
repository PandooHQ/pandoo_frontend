import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { I18nProvider } from './app/providers/I18nProvider'
import "./app/i18n"
import { AppRouter } from './app/router/AppRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <I18nProvider>
        <AppRouter />
      </I18nProvider>
  </StrictMode>,
)
