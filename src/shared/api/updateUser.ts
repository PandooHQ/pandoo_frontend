import type { UpdateUserInput } from "../types/UsersContextType";
import api from "./api";


export const updateUser = async (id: number | string, userData: UpdateUserInput) => {
  if (userData.profile_picture instanceof File) {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== "id") {
        formData.append(`user[${key}]`, value as string);
      }
    });

    const response = await api.put(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  const response = await api.put(`/users/${id}`, { user: userData });
  return response.data;
};