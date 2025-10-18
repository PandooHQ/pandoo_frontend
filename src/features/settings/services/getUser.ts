import api from "@/shared/api/api"

export const getUser = async(id:number)=>{
    const {data} = await api.get(`/users/${id}`)

    console.log(data)   
    return data.data
}