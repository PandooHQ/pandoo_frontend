import api from "@/shared/api/api"

export const deleteForm = async(id:number)=>{
    const resp = await api.delete(`/forms/${id}`)

    return resp;
}