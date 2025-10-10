/* eslint-disable @typescript-eslint/no-explicit-any */
import NumberFormInput from "./NumberFormInput";
import SignatureFormInput from "./SignatureFormInput";
import DateFormInput from "./DateFormInput";
import TextFormInput from "./TextFormInput";
import SelectFormInput from "./SelectFormInput";
import type { FormInputField } from "../../types/FormInputField";

interface FormFieldRendererProps {
  input: FormInputField;
  value?: any;
  onChange?: (name: string, value: any) => void;
}

export const FormFieldRenderer = ({ input, value, onChange }: FormFieldRendererProps) => {
  const handleFieldChange = (val: any) => {
    onChange?.(input.name, val);
  };

  switch (input.type) {
    case "text":
      return <TextFormInput field={input} value={value} onChange={handleFieldChange} />;
    case "datetime":
      return <DateFormInput field={input} value={value} onChange={handleFieldChange} />;
    case "number":
      return <NumberFormInput field={input} value={value} onChange={handleFieldChange} />;
    case "select":
      return <SelectFormInput field={input} value={value} onChange={handleFieldChange} />;
    case "signature":
      return <SignatureFormInput field={input} value={value} onChange={handleFieldChange} />;
    default:
      return <p>Tipo no soportado: {(input as any).type}</p>;
  }
};
