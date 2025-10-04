import api from "@/shared/api/api"

export const getUserResponses = async()=>{
    const {data} = await api.get("/form_responses")

    return data.data
}   