import api from "./api";

export const getUsers = async (role_id?: string) => {
  const resp = await api.get("/users", {
    params: role_id ? { role_id } : {}
  });

  return resp.data;
};
