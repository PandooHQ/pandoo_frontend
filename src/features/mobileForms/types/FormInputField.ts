type BaseResponse = {
  value?: string;
};

type SelectResponse = {
  values?: number[];
};

type BaseField = {
  id: number;
  name: string;
  label: string;
  required?: boolean;
};

type TextField = BaseField & {
  type: "text";
  default_value?: string | null;
  response?: BaseResponse;
};

type NumberField = BaseField & {
  type: "number";
  default_value?: number | null;
  response?: BaseResponse;
};

type DateField = BaseField & {
  type: "datetime";
  default_value?: string | null;
  field_type: string;
  response?: BaseResponse;
};

type SelectOption = { id: number; value: string };

type SelectField = BaseField & {
  type: "select";
  multiple?: boolean;
  include_blank?: boolean;
  options?: SelectOption[];
  response?: SelectResponse; 
};

type SignatureField = BaseField & {
  type: "signature";
  response?: BaseResponse;
};

export type FormInputField =
  | TextField
  | NumberField
  | DateField
  | SelectField
  | SignatureField;
