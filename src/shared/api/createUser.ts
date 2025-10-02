import type { CreateUserInput, User } from "../types/UsersContextType";
import api from "./api";

export const createUser = async (userData: CreateUserInput): Promise<User> => {
    const resp = await api.post("/users", { user: userData });
    return resp.data;
}