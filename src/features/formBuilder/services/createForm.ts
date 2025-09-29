import type {Form} from "@/features/forms/types/FormNormalized"
import api from "@/shared/api/api"

export const createForm = async(data: Form) => {
    return await api.post('/admin/forms', data)
}