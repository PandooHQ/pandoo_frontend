type BaseField = {
  id: number;
  name: string;
  label: string;
  required?: boolean;
  response?: {
    value?: string
  }
};

type TextField = BaseField & {
  type: "text";
  default_value?: string | null;
};

type NumberField = BaseField & {
  type: "number";
  default_value?: number | null;
};

type DateField = BaseField & {
  type: "datetime";
  default_value?: string | null;
  field_type: string;
};

type SelectOption = { id: number; value: string };

type SelectField = BaseField & {
  type: "select";
  multiple?: boolean;
  include_blank?: boolean;
  options?: SelectOption[];
};

type SignatureField = BaseField & {
  type: "signature";
};

export type FormInputField =
  | TextField
  | NumberField
  | DateField
  | SelectField
  | SignatureField;
