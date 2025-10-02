import api from "@/shared/api/api"

export const getForm = async(id: number) => {
    const resp = await api.get(`/admin/forms/${id}`)

    return resp
}