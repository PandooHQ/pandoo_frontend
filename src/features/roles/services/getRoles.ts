import api from "@/shared/api/api";

export const getRoles = async () => {
  const { data } = await api.get("/roles");
  return data.data || [];
};
