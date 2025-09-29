import type { FormType } from "../../features/forms/types/FormType";
import api from "@/shared/api/api";

export const getForms = async (): Promise<FormType[]> => {
  const res = await api.get<{ data: FormType[] }>("/admin/forms");
  return res.data.data || []; 
};
