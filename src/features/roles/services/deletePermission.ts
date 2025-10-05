import api from "@/shared/api/api";

export const deletePermission = async (
  roleId: number,
  permissionId: number
) => {
  const resp = await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
  return resp.data;
};
