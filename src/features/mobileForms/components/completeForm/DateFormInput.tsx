import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

interface DateFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    required?: boolean;
    default_value?: string | null;
    field_type: string
    response? : { value? : string}
  };
  value?: string;
  onChange?: (value: string) => void;
}

const DateFormInput = ({ field, value, onChange }: DateFormInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`field-${field.id}`}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Input
        id={`field-${field.id}`}
        type={field.field_type || "date"} 
        name={field.name}
        required={field.required}
        value={value ?? field?.response?.value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default DateFormInput;
