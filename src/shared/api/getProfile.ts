import api from "./api";

export const getProfile = async () => {

    const resp = await api.get('/auth/me');

    return resp.data
}