import api from "./api";

export const getUsers = async() => {
    const resp = await api.get('/users');

    return resp.data
}