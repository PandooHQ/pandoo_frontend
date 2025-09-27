import type { Form } from "@/features/forms/types/FormNormalized"
import api from "@/shared/api/api"

export const createForm = async(data: Form) => {
    const resp = await api.post('/forms', data)

    return resp
}