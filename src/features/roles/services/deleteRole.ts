import api from "@/shared/api/api";

export const deleteRole = async (id: number) => {
    const resp = await api.delete(`/roles/${id}`);
    return resp.data;
}