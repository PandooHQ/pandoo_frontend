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
  const formData = new FormData();

  for (const [key, value] of Object.entries(userData)) {
    if (value === undefined) continue;

    if (key === "profile_picture" && value instanceof File) {
      formData.append("user[profile_picture]", value); 
    } else {
      formData.append(
        `user[${key}]`,
        value === null ? "" : String(value) 
      );
    }
  }

  const response = await api.put(`/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
