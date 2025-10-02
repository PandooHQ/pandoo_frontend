import api from "@/shared/api/api"
import type { Assignment } from "../types/AssignmentContextType"
    
export const getFormResponseUser = async(): Promise<Assignment[]> => {
    const {data} = await api.get("/form_responses")

    return data.data
}