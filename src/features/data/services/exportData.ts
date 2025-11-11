import api from "@/shared/api/api"

export const exportData = async (id: number, startDate?: string, endDate?: string) => {
  const resp = await api.get(`/admin/forms/${id}/responses/export`, {
    params: { start_date: startDate, end_date: endDate },
    responseType: "blob",
  });
  
  return resp.data;
};
