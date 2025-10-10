import api from "@/shared/api/api"
import type { FormResponse } from "../types/FormResponse"

export const createFormResponse = async(data: FormResponse) => {
    const resp = await api.post("form_responses", data)

    return resp
}