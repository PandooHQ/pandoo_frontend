import type { FormResponse } from "@/features/formEntry/types/FormResponse";
import api from "@/shared/api/api";

export const updateUserResponse = async (id: number, data: FormResponse) => {
  console.log(data)
  const resp = await api.put(`form_responses/${id}`,data);
  return resp.data;
};
