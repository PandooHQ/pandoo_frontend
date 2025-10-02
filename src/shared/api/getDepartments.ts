import type { Department } from "../types/DepartmentsContextType";
import api from "./api";

export const getDepartments = async (): Promise<Department[]> => {
  const resp = await api.get("/departments");
  return resp.data.data;
}