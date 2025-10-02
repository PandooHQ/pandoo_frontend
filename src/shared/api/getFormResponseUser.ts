import api from "@/shared/api/api"
import type { Assignment } from "../types/AssignmentContextType"

interface AssignmentResponse {
    data: {
        assignment: Assignment[]
    }
}

export const getFormResponseUser = async(): Promise<AssignmentResponse> => {
    const resp = await api.get("/form_responses")

    return resp.data
}