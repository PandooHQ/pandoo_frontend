import api from "@/shared/api/api"

export const deleteForm = async(id:number)=>{
    return await api.delete(`/admin/forms/${id}`);
}