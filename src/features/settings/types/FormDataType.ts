export interface FormDataType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  position_id: number | null;
  department_id: number | null;
  position: string;
  department: string;
  profile_picture: string | File;
  created_at: string | undefined;
  status: string | undefined;
}

export interface UserDataType {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    status: string | undefined;
    joinDate: string | undefined;
    location: string;
    avatar: string | File;
}