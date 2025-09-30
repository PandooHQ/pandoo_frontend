import api from "@/shared/api/api"

export const getUser = async(id:number)=>{
    const resp = api.get(`/users/${id}`)

    return resp
}