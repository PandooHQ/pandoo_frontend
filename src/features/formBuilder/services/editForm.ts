import type { Form } from "@/features/forms/types/FormNormalized"
import api from "@/shared/api/api"

export const editForm = async(id: number,data: Form) => {
    const resp = await api.put(`/forms/${id}`, data)

    return resp
}