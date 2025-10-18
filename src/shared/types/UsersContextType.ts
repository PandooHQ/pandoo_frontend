import type { Department } from "./DepartmentsContextType";
import type { Position } from "./PositionsContextType";

export interface UsersContextType {
    users: User[];
    updateUser: (userData: UpdateUserInput) => Promise<User>;
    createUser: (userData: CreateUserInput) => Promise<User>;
}

export interface User {
    id:         string;
    email:      string;
    created_at: Date;
    updated_at: Date;
    role_id:    number | null;
    first_name: string;
    last_name:  string;
    role?:      Role;
    department: Department;
    position:   Position;
    profile_picture?: File;
    phone?:     string;
    location?:  string;
    department_id?: string;
    position_id?: string
}

export interface CreateUserInput {
    email:      string;
    first_name: string;
    last_name:  string;
    department_id: number | string;
    position_id:   number | string;
    phone?:     string;
    location?:  string;
}

export interface Role {
    id:          number;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}


export type UpdateUserInput = Partial<
  Omit<User, "id" | "position_id" | "department_id">
> & { 
  id: string;
  position_id?: number | null;
  department_id?: number | null;
};