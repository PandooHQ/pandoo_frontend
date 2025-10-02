import { createContext } from "react";
import type { Department, DepartmentsContextType } from "../types/DepartmentsContextType";

const defaultValue: DepartmentsContextType = {
  departments: [],
  createDepartment: async () => {
    return {} as Department;
  },
};

export const DepartmentsContext = createContext<DepartmentsContextType>(defaultValue);
