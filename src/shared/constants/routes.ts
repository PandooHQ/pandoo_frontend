import {
  LayoutDashboard,
  NotebookPen,
  NotebookText,
  Database,
  Users,
  Shield,
} from "lucide-react";

const data = {
  navMain: [
    {
      titleKey: "menu.dashboard",
      url: "/dashboard",
      items: [],
      icon: LayoutDashboard,
    },
    {
      titleKey: "menu.create_form",
      url: "/forms/blank",
      items: [],
      icon: NotebookPen,
    },
    { titleKey: "menu.my_forms", url: "/forms", items: [], icon: NotebookText },
    {
      titleKey: "menu.form_data",
      url: "/forms/data",
      items: [],
      icon: Database,
    },
    {
      titleKey: "menu.personnel_management",
      url: "/personnel",
      items: [],
      icon: Users,
    },
    {
      titleKey: "menu.roles_and_permisions.title",
      url: "#",
      icon: Shield,
      items: [
        {
          titleKey: "menu.roles_and_permisions.submenu.roles_overview",
          url: "/roles/overview",
        },
        {
          titleKey: "menu.roles_and_permisions.submenu.permission_matrix",
          url: "/roles/permissions",
        },
        {
          titleKey: "menu.roles_and_permisions.submenu.role_assignments",
          url: "/roles/assignments",
        },
      ],
    },
  ],
};

export default data;
