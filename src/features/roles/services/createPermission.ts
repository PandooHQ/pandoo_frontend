import api from "@/shared/api/api";
import type { PermissionData } from "../types/PermissionDataType";


export const createPermission = async (
  roleId: number,
  permission: PermissionData
) => {
  const resp = await api.post(`/roles/${roleId}/permissions`, permission);
  return resp.data;
};
