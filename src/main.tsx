import { createRoot } from "react-dom/client";
import "./index.css";
import { I18nProvider } from "./app/providers/I18nProvider";
import "./app/i18n";
import { AppRouter } from "./app/router/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
        <AppRouter />
    </I18nProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
