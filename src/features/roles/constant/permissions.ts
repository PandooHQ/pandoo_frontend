import { Shield, FileText, User, Key, CheckCircle2 } from "lucide-react";

export const allPermissions = [
  {
    subject: "User",
    label: "Usuarios",
    icon: User,
    description: "Gestión de usuarios del sistema",
    actions: ["manage", "assign_roles", "create", "read", "update", "destroy"],
  },
  {
    subject: "Form",
    label: "Formularios",
    icon: FileText,
    description: "Gestión de formularios",
    actions: [
      "manage",
      "publish",
      "unpublish",
      "duplicate",
      "create",
      "read",
      "update",
      "destroy",
    ],
  },
  {
    subject: "FormResponse",
    label: "Respuestas",
    icon: CheckCircle2,
    description: "Gestión de respuestas de formularios",
    actions: ["manage", "create", "read", "update", "destroy"],
  },
  {
    subject: "Role",
    label: "Roles",
    icon: Shield,
    description: "Gestión de roles del sistema",
    actions: ["manage", "create", "read", "update", "destroy"],
  },
  {
    subject: "Permission",
    label: "Permisos",
    icon: Key,
    description: "Gestión de permisos",
    actions: ["manage", "create", "read", "update", "destroy"],
  },
];

export const actionLabels: Record<string, string> = {
  assign_roles: "Asignar Roles",
  manage: "Gestionar Todo",
  create: "Crear",
  read: "Leer",
  update: "Actualizar",
  destroy: "Eliminar",
  publish: "Publicar",
  unpublish: "Despublicar",
  duplicate: "Duplicar",
};
