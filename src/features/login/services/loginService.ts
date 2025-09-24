import api from "@/shared/api/api"
import type { UserLogin } from "../types/UserLoginType"

interface Response {
    token: string;
}

export const login = async(data:UserLogin)=>{

    const resp = api.post<Response>('/auth/sign_in', data)

    return resp
}