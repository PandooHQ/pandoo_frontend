import api from "@/shared/api/api"

export const editForm = async(id: number,data: unknown) => {
    return await api.put(`/admin/forms/${id}`, data)
}