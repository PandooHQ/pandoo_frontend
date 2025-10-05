import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoles } from "../services/getRoles";
import { createRole } from "../services/createRole";
import { deleteRole } from "../services/deleteRole";
import { createPermission } from "../services/createPermission";
import type { PermissionData } from "../types/PermissionDataType";
import { deletePermission } from "../services/deletePermission";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const createRoleMutation = useMutation({
    mutationKey: ["createRole"],
    mutationFn: (newRoleData: { name: string; description: string }) =>
      createRole({ role: newRoleData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: (roleId: number) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const createPermissionMutation = useMutation({
    mutationKey: ["createPermission"],
    mutationFn: (data: { roleId: number; permissionData: PermissionData }) =>
      createPermission(data.roleId, data.permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const deletePermissionMutation = useMutation({
    mutationKey: ["createPermission"],
    mutationFn: (data: {roleId: number; permissionId: number}) =>
      deletePermission(data.roleId, data.permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return {
    roles,
    isLoading,
    error,
    createRole: createRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
    createPermissionMutation: createPermissionMutation.mutateAsync,
    deletePermissionMutation: deletePermissionMutation.mutateAsync
  };
};
