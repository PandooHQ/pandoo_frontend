import api from "@/shared/api/api"

export const getFormReponseById = async(id: number) => {
    const {data} = await api.get(`form_responses/${id}`)

    return data
}