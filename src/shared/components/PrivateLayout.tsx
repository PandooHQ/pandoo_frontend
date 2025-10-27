import { Link, Outlet, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "./ui/sidebar";
import CustomizeHeader from "./CustomizeHeader";
import { useEffect } from "react";
import i18n from "@/app/i18n";
import data from "../constants/routes";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import { RolesProvider } from "@/features/roles/hooks/RolesProvider";
import { UsersProvider } from "../hooks/UsersProvider";
import { FormsProvider } from "@/features/forms/hooks/FormProvider";
import { useAuthStore } from "../stores/auth";
import { DepartmentsProvider } from "../hooks/DepartmentsProvider";
import { PositionsProvider } from "../hooks/PositionsProvider";
import { AssignmentProvider } from "../hooks/AssignmentProvider";
import { OrganizationProvider } from "@/features/settings/hooks/OrganizationProvider";

export function PrivateLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  useEffect(() => {
    if (lang && ["en", "es"].includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <SidebarProvider>
      <FormsProvider>
        <DepartmentsProvider>
          <PositionsProvider>
            <OrganizationProvider>
              <AssignmentProvider>
                <RolesProvider>
                  <UsersProvider>
                    <div className="flex h-screen min-w-screen">
                      <Sidebar>
                        <SidebarHeader>
                          <div className="flex flex-col space-y-1 px-2 py-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg text-primary-foreground">
                                <img src="/LogoPandoo.png" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-lg font-semibold">
                                  Pandoo
                                </span>
                                <span className="text-xs text-muted-foreground"></span>
                              </div>
                            </div>
                          </div>
                        </SidebarHeader>
                        <SidebarContent>
                          <SidebarGroup>
                            <SidebarGroupLabel>Menú</SidebarGroupLabel>
                            <SidebarGroupContent>
                              <SidebarMenu>
                                {data.navMain.map((item) => (
                                  <SidebarMenuItem key={item.titleKey}>
                                    <SidebarMenuButton asChild>
                                      <Link
                                        to={`/${lang}${item.url}`}
                                        className="flex items-center gap-2"
                                      >
                                        <item.icon className="w-4 h-4" />
                                        <span>{t(item.titleKey)}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </SidebarMenu>
                            </SidebarGroupContent>
                          </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                          <SidebarGroup>
                            <SidebarGroupContent>
                              <div className="flex items-center space-x-3 px-2 py-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      typeof user?.profile_picture === "string"
                                        ? user.profile_picture
                                        : user?.profile_picture instanceof File
                                          ? URL.createObjectURL(
                                              user.profile_picture
                                            )
                                          : undefined
                                    }
                                    alt="User"
                                  />
                                  <AvatarFallback>
                                    {user?.first_name?.[0]?.toUpperCase() || ""}
                                    {user?.last_name?.[0]?.toUpperCase() || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {user?.first_name} {user?.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {typeof user?.position === "string"
                                      ? user.position
                                      : user?.position?.name}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/${lang}/settings`}>
                                    <Settings className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </SidebarGroupContent>
                          </SidebarGroup>
                        </SidebarFooter>
                      </Sidebar>

                      <main className="flex-1 overflow-y-auto h-full">
                        <CustomizeHeader />
                        <Outlet />
                      </main>
                    </div>
                  </UsersProvider>
                </RolesProvider>
              </AssignmentProvider>
            </OrganizationProvider>
          </PositionsProvider>
        </DepartmentsProvider>
      </FormsProvider>
    </SidebarProvider>
  );
}
