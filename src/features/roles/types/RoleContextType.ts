import type { Role } from "./RolesType";

export interface RolesContextType {
  roles: Role[] | undefined;
  isLoading: boolean;
  error: unknown;
  createRole: (data: { name: string; description: string }) => Promise<Role>;
  deleteRole: (roleId: number) => void;
  createPermissionMutation: (data: { roleId: number; permissionData: { action: string; subject_class: string; description: string } }) => Promise<void>;
  deletePermissionMutation: (data: { roleId: number; permissionId: number }) => Promise<void>;
}