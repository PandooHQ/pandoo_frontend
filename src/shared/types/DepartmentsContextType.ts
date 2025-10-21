
export interface DepartmentsContextType {
    departments: Department[];
    createDepartment: (deparment: CreateDeparmentInput) => Promise<DepartmentResp>;
}

export interface DepartmentResp {
     data: {
        id: number,
        name: string
    }
}

export interface Department {
    id:          number;
    name:        string;
}

export type CreateDeparmentInput = {
    name: string;
    id?: string;
};

export type UpdateDeparmentInput = Partial<
  Omit<Department, "id">
> & { id: string };
