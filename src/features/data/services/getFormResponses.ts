import api from "@/shared/api/api"

export const getFormResponses = async(id:number)=>{
    const { data } = await api.get(`/admin/forms/${id}/responses`)

    return data.data || []
}