import api from "@/shared/api/api"

export const exportData = async (id: number) => {
  const resp = await api.get(`/forms/${id}/responses/export`, {
    responseType: "blob", 
  });
  
  return resp.data; 
};
