import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface SelectOption {
  id: number;
  value: string;
}

interface SelectFormInputProps {
  field: {
    id: number;
    name: string;
    label: string;
    required?: boolean;
    multiple?: boolean;
    include_blank?: boolean;
    options?: SelectOption[];
    default_value?: string | string[] | null;
  };
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

const SelectFormInput = ({ field, value, onChange }: SelectFormInputProps) => {
  const {
    id,
    name,
    label,
    required,
    multiple,
    include_blank,
    options = [],
    default_value,
  } = field;

  const currentValue = value ?? default_value ?? (multiple ? [] : "");

  if (multiple) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor={`field-${id}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        <select
          id={`field-${id}`}
          name={name}
          multiple
          required={required}
          value={currentValue as string[]}
          onChange={(e) =>
            onChange?.(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {include_blank && <option value="">Selecciona una opción</option>}
          {options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={`field-${id}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Select
        onValueChange={(val) => onChange?.(val === "__none__" ? "" : val)}
        value={value === "" ? "__none__" : ((value as string) ?? "")}
      >
        <SelectTrigger id={`field-${id}`} className="w-full">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.value}>
              {opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFormInput;
