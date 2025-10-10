import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface Props {
  field: {
    id: number;
    label: string;
    placeholder?: string | null;
    required?: boolean;
    default_value?: string | null;
    max_length?: number | null;
    min_length?: number | null;
    response? : { value? : string}
  };
  value?: string;
  onChange?: (value: string) => void;
}

const TextFormInput = ({ field, value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`field-${field.id}`} className="text-">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={`field-${field.id}`}
        type="text"
        placeholder={field.placeholder || ""}
        required={field.required || false}
        value={value ?? field?.response?.value ?? ""}
        minLength={field.min_length ?? undefined}
        maxLength={field.max_length ?? undefined}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default TextFormInput;
