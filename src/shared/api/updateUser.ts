import type { UpdateUserInput, User } from "../types/UsersContextType";
import api from "./api";

// export const updateUser = async (userId: string, data: UpdateUserData) => {
//   const resp = await api.put(`/users/${userId}`, data);

//   return resp;
// };


export const updateUser = async (
  id: string,
  data: { user: UpdateUserInput }
): Promise<User> => {
  const resp = await api.put<{ user: User }>(`/users/${id}`, data)
  return resp.data.user 
}
