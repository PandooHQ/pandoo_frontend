import type { CreateDeparmentInput, DepartmentResp } from "../types/DepartmentsContextType";
import api from "./api";

export const createDepartments = async (name : CreateDeparmentInput): Promise<DepartmentResp> => {
  
    const resp = await api.post("/departments", name );
  
    return resp.data;
}