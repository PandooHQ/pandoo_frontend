export interface ItemOption {
  id: number;
  label: string;
  value: string;
}

export interface ItemType {
    id: string,
    label: string, 
    required: boolean,
    type: string,
    options?: ItemOption[]
}