import api from "@/shared/api/api"

export const getForm = async(id: number) => {
    const resp = await api.get(`/forms/${id}`)

    console.log(resp.data)
    return resp
}