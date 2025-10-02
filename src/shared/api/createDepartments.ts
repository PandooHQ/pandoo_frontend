import type { CreateDeparmentInput, Department } from "../types/DepartmentsContextType";
import api from "./api";

export const createDepartments = async (name : CreateDeparmentInput): Promise<Department> => {
  
    const resp = await api.post("/departments", name );
  
    return resp.data;
}