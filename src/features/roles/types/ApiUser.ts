export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  role?: { name?: string };
  position?: { name?: string };
  department?: { name?: string };
  profile_picture?: string;
  hasAdminRole?: boolean;
  name?: string;
}
