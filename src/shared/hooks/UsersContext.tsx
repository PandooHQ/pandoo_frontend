import { createContext } from "react";
import type { User, UsersContextType } from "../types/UsersContextType";

const defaultValue: UsersContextType = {
  users: [],
  updateUser: async () => {
    return {} as User;
  },
  createUser: async () => {
    return {} as User;
  }
};

export const UsersContext = createContext<UsersContextType>(defaultValue);
