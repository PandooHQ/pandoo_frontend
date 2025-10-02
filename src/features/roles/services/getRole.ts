import type { AxiosResponse } from "axios";
import type { Role } from "../types/RolesType";
import api from "@/shared/api/api";

interface RoleResponse {
  data: Role;
}

export const getRole = async (id: number): Promise<Role> => {
  const resp: AxiosResponse<RoleResponse> = await api.get(`/roles/${id}`);
  return resp.data.data; 
};
