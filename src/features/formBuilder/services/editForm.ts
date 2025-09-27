import api from "@/shared/api/api"

export const editForm = async(id: number,data: unknown) => {
    const resp = await api.put(`/forms/${id}`, data)

    return resp
}