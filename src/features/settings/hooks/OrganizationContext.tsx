import { createContext } from "react";
import type { OrganizationContextType, OrganizationType } from "../types/OrganizationType";

const defaultValue: OrganizationContextType = {
  organization: {id: 0, name:"default"},
  updateOrganization: async () => {
    return {} as OrganizationType;
  },
};

export const OrganizationContext = createContext<OrganizationContextType>(defaultValue);
