/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AssignmentContextType {
    assignments: Assignment[];
    createAssignment: (data: CreateAssignmentInput) => Promise<any>;
}

export interface Assignment {
    id:         number;
    title:      string;
    created_at: string;
    status:     string;
}

export interface CreateAssignmentInput {
    user_id: number;
    id: number
}
