import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface CheckboxOption {
  id: number;
  value: string;
}

interface CheckboxFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    required?: boolean;
    inline?: boolean;
    options?: CheckboxOption[];
    default_value?: string[] | null;
  };
  value?: string[];
  onChange?: (value: string[]) => void;
}

const CheckboxFormInput = ({ field, value, onChange }: CheckboxFormInputProps) => {
  const {
    id,
    name,
    label,
    required,
    inline = false,
    options = [],
    default_value = [],
  } = field;

  const selectedValues = value ?? default_value ?? [];

  const toggleValue = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange?.(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange?.([...selectedValues, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={`field-${id}`} className="font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div
        className={`flex ${inline ? "flex-row flex-wrap gap-4" : "flex-col gap-2"}`}
      >
        {options.map((opt) => (
          <label
            key={opt.id}
            htmlFor={`${name}-${opt.id}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              id={`${name}-${opt.id}`}
              checked={selectedValues.includes(opt.value)}
              onCheckedChange={() => toggleValue(opt.value)}
            />
            <span>{opt.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxFormInput;
