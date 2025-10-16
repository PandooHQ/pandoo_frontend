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
    default_value?: number[] | null;
  };
  value?: number[];
  onChange?: (value: number[]) => void;
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

  const selectedIds = (value ?? default_value ?? []).filter(
    (v): v is number => typeof v === "number"
  );

  const toggleValue = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onChange?.(selectedIds.filter((v) => v !== optionId));
    } else {
      onChange?.([...selectedIds, optionId]);
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
              checked={selectedIds.includes(opt.id)}
              onCheckedChange={() => toggleValue(opt.id)}
            />
            <span>{opt.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxFormInput;
