export interface ItemOption {
  id: number;
  label?: string;
  value?: string;
  name?: string
}

export interface ItemImageData {
  filename: string;
  content_type: string;
}
export interface ItemType {
    id: string;
    label: string; 
    required: boolean;
    description?: string;
    type: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    options?: ItemOption[];
    image_data?: ItemImageData;
    allow_decimal?: boolean;
    imageUrl?: string;
}