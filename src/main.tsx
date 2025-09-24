import { createRoot } from "react-dom/client";
import "./index.css";
import { I18nProvider } from "./app/providers/I18nProvider";
import "./app/i18n";
import { AppRouter } from "./app/router/AppRouter";
import { FormsProvider } from "./features/forms/hooks/FormProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <FormsProvider>
        <AppRouter />
      </FormsProvider>
    </I18nProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
