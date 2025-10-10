import api from "@/shared/api/api"

export const getFormInputById = async(id: number) =>{
    const {data} = await api.get(`form_assignments/${id}`)

    console.log(data.data)
    return data.data || []
}