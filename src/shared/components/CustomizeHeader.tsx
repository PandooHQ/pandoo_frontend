import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function CustomizeHeader() {
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumbSegments = segments.filter((seg) => seg !== lang);
  const currentRoute = breadcrumbSegments[breadcrumbSegments.length - 1];

  const navigate = useNavigate();

  const handleLogout = () => {
    useAuthStore.getState().clearAuth();
    navigate(`/${lang}/login`);
  };

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbSegments.slice(0, -1).flatMap((segment, index) => {
                const path = `/${[lang, ...breadcrumbSegments.slice(0, index + 1)].join("/")}`;
                return [
                  <BreadcrumbItem
                    key={`item-${index}`}
                    className="hidden md:flex"
                  >
                    <BreadcrumbLink href={path}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>,
                  <BreadcrumbSeparator key={`sep-${index}`} />,
                ];
              })}

              <BreadcrumbPage className="font-semibold text-primary">
                {currentRoute
                  ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)
                  : "Inicio"}
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-red-600 transition mr-5 hover:text-white"
          onClick={handleLogout}
          variant={"ghost"}
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </Button>
      </header>
    </SidebarInset>
  );
}
