export interface UsersContextType {
    users: User[];
    updateUser: (userData: UpdateUserInput) => Promise<User>;
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
    department: string;
    position:   string;
}

export interface Role {
    id:          number;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

export type UpdateUserInput = Partial<
  Omit<User, "id">
> & { id: string };
