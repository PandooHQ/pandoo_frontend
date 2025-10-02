import api from "@/shared/api/api"
import type { UserLogin } from "../types/UserLoginType"


export const login = async(data:UserLogin) => {

    const resp = await api.post('/auth/sign_in', data);

    return resp;
}