import api from "@/shared/api/api"

export const getOrganization = async() =>{
    const {data} = await api.get('/admin/organization')

    return data
}