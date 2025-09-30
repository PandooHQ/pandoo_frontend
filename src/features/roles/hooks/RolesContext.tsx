import { createContext } from "react";
import type { RolesContextType } from "../types/RoleContextType";

const defaultValue: RolesContextType = {
  roles: [],
  isLoading: false,
  error: null,
  createRole: () => { return Promise.resolve({ id: 0, name: '', description: '' }) },
  deleteRole: () => {},
};

export const RolesContext = createContext<RolesContextType>(defaultValue);
