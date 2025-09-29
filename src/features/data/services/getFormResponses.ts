import api from "@/shared/api/api"

export const getFormResponses = async(id:number)=>{
    const resp = await api.get(`/admin/forms/${id}/responses`)

    return resp.data || []
}