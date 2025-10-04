import api from "@/shared/api/api"
import type { CreateAssignmentInput } from "../types/AssignmentContextType"

export const createFormResponseUser = async({user_id, id}: CreateAssignmentInput)=>{
    const resp = await api.post(`admin/forms/${id}/assignments`, {user_id: user_id    })

    return resp
}