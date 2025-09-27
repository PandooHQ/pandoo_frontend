export interface ItemOption {
  id: number;
  label?: string;
  value?: string;
  name?: string
}

export interface ItemType {
    id: string;
    label: string; 
    required: boolean;
    type: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    options?: ItemOption[];
}