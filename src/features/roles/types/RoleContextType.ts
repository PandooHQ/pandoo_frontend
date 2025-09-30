import type { Role } from "./RolesType";

export interface RolesContextType {
  roles: Role[] | undefined;
  isLoading: boolean;
  error: unknown;
  createRole: (data: { name: string; description: string }) => Promise<Role>;
  deleteRole: (roleId: number) => void;
  createPermissionMutation: (data: { roleId: number; permissionData: { action: string; subject_class: "User" | "Role" | "Form" | "FormResponse" | "Permission"; description: string } }) => Promise<void>;
}