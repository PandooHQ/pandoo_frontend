import api from "@/shared/api/api";
import type { Role } from "../types/RolesType";

interface newRole {
    role: { name: string; description: string }
}

export const createRole = async (data : newRole): Promise<Role>  => {
    const resp = await api.post("/roles", data);
    return resp.data.data;
}