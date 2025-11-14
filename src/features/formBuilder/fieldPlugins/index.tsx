import type { ItemType } from "../types/ItemType";
import { DateField } from "./date/DateField";
import { SelectField } from "./select/SelectField";
import { TextField } from "./text/TextField";
import { CheckboxField } from "./checkbox/CheckboxField";
import { SignatureField } from "./signature/SignatureField";
import { HourField } from "./hour/HourField";
import { NumberField } from "./number/NumberFIeld";
import { InstructionFIeld } from "./instruction/InstructionFIeld";

interface FormFieldsProps {
  item: ItemType;
  updateField?: (updates: Partial<ItemType>) => void;
  updateOption?: (
    optId: number,
    updates: Partial<{
      label: string;
      value: string;
    }>
  ) => void;
  removeOption?: (optId: number) => void;
  addOption?: () => void;
  onUpdate: (id: string, updates: Partial<ItemType>) => void;
}

function normalizeType(item: ItemType) {
  if (item.type === "datetime") {
    return item.field_type === "time" ? "time" : "date";
  }

  if (item.type === "instructions") {
    return "instruction";
  }

  return item.type;
}

export const FormFieldRenderer = ({
  item,
  updateField,
  updateOption,
  removeOption,
  addOption,
  onUpdate,
}: FormFieldsProps) => {
  const renderType = normalizeType(item);

  switch (renderType) {
    case "text":
      return (
        <TextField
          id={item.id}
          required={item.required}
          updateField={updateField}
        />
      );

    case "date":
      return (
        <DateField
          id={item.id}
          required={item.required}
          updateField={updateField}
        />
      );

    case "time":
      return (
        <HourField
          id={item.id}
          required={item.required}
          updateField={updateField}
        />
      );

    case "number":
      return (
        <NumberField
          id={item.id}
          required={item.required}
          updateField={updateField}
        />
      );

    case "select":
      return (
        <SelectField
          id={item.id}
          required={item.required}
          updateField={updateField}
          updateOption={updateOption}
          removeOption={removeOption}
          addOption={addOption}
          options={item.options ?? []}
        />
      );

    case "signature":
      return (
        <SignatureField
          id={item.id}
          required={item.required}
          updateField={updateField}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          id={item.id}
          required={item.required}
          updateField={updateField}
          updateOption={updateOption}
          removeOption={removeOption}
          addOption={addOption}
          options={item.options ?? []}
        />
      );

    case "instruction":
      return (
        <InstructionFIeld
          id={item.id}
          description={item.description ?? ""}
          image_data={item.image_data}
          imageUrl={item.imageUrl}
          onUpdate={onUpdate}
          updateField={updateField}
          required={item.required}
        />
      );

    default:
      return <p>Tipo no soportado: {String(item.type)}</p>;
  }
};
