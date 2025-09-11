import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { I18nProvider } from "./app/providers/I18nProvider";
import "./app/i18n";
import { AppRouter } from "./app/router/AppRouter";
import { FormsProvider } from "./features/forms/hooks/FormProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <FormsProvider>
        <AppRouter />
      </FormsProvider>
    </I18nProvider>
  </StrictMode>
);
