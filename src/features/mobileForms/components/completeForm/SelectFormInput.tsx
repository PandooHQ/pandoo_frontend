import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface SelectOption {
  id?: number;
  value?: string;
}

interface ResponseField {
  values?: number[];
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
    default_value?: number | number[] | null;
    response?: ResponseField;
  };
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
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
    response,
  } = field;

  // el valor actual será: value -> response -> default_value
  const currentValue =
    value ??
    (response?.values
      ? multiple
        ? response.values
        : response.values[0]
      : (default_value ?? (multiple ? [] : "")));

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
          value={(currentValue as number[]).map(String)}
          onChange={(e) =>
            onChange?.(
              Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
              )
            )
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {include_blank && <option value="">Selecciona una opción</option>}
          {options.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
              {opt.value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const selectedOption = options.find((opt) => opt.id === currentValue);
  const selectedValue = selectedOption ? String(selectedOption.id) : "__none__";

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={`field-${id}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Select
        onValueChange={(val) =>
          onChange?.(val === "__none__" ? 0 : Number(val))
        }
        value={selectedValue}
      >
        <SelectTrigger id={`field-${id}`} className="w-full">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>

        <SelectContent className="w-full">
          {include_blank && (
            <SelectItem value="__none__">Selecciona una opción</SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={opt.id} value={String(opt.id)}>
              {opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFormInput;
