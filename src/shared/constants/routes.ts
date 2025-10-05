import {
  NotebookPen,
  NotebookText,
  Database,
  Users,
  Shield,
  House,
} from "lucide-react";

const data = {
  navMain: [
    {
      titleKey: "menu.home",
      url: "/",
      items: [],
      icon: House,
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
    // {
    //   titleKey: "menu.form_entry",
    //   url: "/forms/form-entry",
    //   items: [],
    //   icon: Smartphone,
    // },
    // {
    //   titleKey: "menu.mobile_forms",
    //   url: "/forms/mobile-forms",
    //   items: [],
    //   icon: Smartphone,
    // },
    {
      titleKey: "menu.personnel_management",
      url: "/personnel",
      items: [],
      icon: Users,
    },
    {
      titleKey: "menu.roles_and_permisions.title",
      url: "/roles",
      icon: Shield,
      items: [],
    },
  ],
};

export default data;
