import api from "@/shared/api/api"

export const updateOrganization = async (formData: FormData) => {
  const resp = await api.patch(`/admin/organization`, formData);

  return resp.data;
};