import { createContext } from "react";
import type { DepartmentResp, DepartmentsContextType } from "../types/DepartmentsContextType";

const defaultValue: DepartmentsContextType = {
  departments: [],
  createDepartment: async () => {
    return {} as DepartmentResp;
  },
};

export const DepartmentsContext = createContext<DepartmentsContextType>(defaultValue);
