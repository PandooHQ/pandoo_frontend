import api from "./api";

interface UserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position_id: number | null;
  department_id: number | null;
  location: string;
  profile_picture: File | undefined;
}

export const updateUser = async (
  id: number | string,
  userData: Partial<UserInput>
) => {
  if (userData.profile_picture instanceof File) {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== "id") {
        formData.append(`user[${key}]`, value !== null ? String(value) : "");
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
