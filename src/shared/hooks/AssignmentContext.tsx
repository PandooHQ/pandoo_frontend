
import { createContext } from "react";
import { type AssignmentContextType, type Assignment } from '../types/AssignmentContextType';

const defaultValue: AssignmentContextType = {
  assignments: [] as Assignment[],
  createAssignment: async () => {
    return {} as Assignment;
  },
};

export const AssignmentContext = createContext<AssignmentContextType>(defaultValue);
