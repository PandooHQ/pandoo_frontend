export interface OrganizationContextType {
    organization: OrganizationType;
    updateOrganization: (position: FormData) => Promise<OrganizationType>;
}

export interface OrganizationType {
  id: number;
  name: string;
  business_name?: string;
  rut?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  website?: string;
  health_resolution?: string;
  sag_resolution?: string;
  technical_representative_name?: string;
  technical_representative_rut?: string;
  additional_info?: string;
  logo?: File | null; 
}