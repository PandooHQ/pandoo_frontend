/* eslint-disable @typescript-eslint/no-explicit-any */
import NumberFormInput from "./NumberFormInput";
import SelectFormInput from "./SelectFormInput";
import SignatureFormInput from "./SignatureFormInput";
import DateFormInput from "./DateFormInput";
import TextFormInput from "./TextFormInput";
import type { FormInputField } from "../types/FormInputFIeld";
import CheckboxFormInput from "./CheckboxFormInput";
import { InstructionFormInput } from "./InstructionFormInput";

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
    case "checkbox":
      return <CheckboxFormInput field={input} value={value} onChange={handleFieldChange} />
    case "instructions":
      return <InstructionFormInput field={input} />;
    
    default:
      return <p>Tipo no soportado: {(input as any).type}</p>;
  }
};
