export interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: Permission[];
}
export interface Permission {
    id:            number;
    action:        string;
    subject_class: string;
    subject_id:    null;
    description:   string;
}