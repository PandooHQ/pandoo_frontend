import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

interface NumberFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    required?: boolean;
    min?: number | null;
    max?: number | null;
    step?: string | number | null;
    allow_decimal?: boolean;
    default_value?: string | number | null;
  };
  value?: number | string;
  onChange?: (value: string) => void;
}

const NumberFormInput = ({ field, value, onChange }: NumberFormInputProps) => {
  const stepValue = field.allow_decimal
    ? field.step ?? "any"
    : parseInt(String(field.step || 1), 10);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`field-${field.id}`}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Input
        id={`field-${field.id}`}
        name={field.name}
        type="number"
        required={field.required}
        min={field.min ?? undefined}
        max={field.max ?? undefined}
        step={stepValue}
        value={value ?? field.default_value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default NumberFormInput;
