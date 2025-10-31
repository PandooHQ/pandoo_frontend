import { ChevronDown, Hash, PenTool, Type, Calendar, ListChecks, Footprints } from "lucide-react";

export const typeMap: Record<string, string> = {
  text: "InputConfigs::TextInput",
  select: "InputConfigs::SelectInput",
  signature: "InputConfigs::SignatureInput",
  number: "InputConfigs::NumberInput",
  date: "InputConfigs::DatetimeInput",
  checkbox: "InputConfigs::CheckboxInput",
  instruction: "InputConfigs::InstructionsInput"
};

export const typeActiveId : Record<string, string> = {
  text: "Entrada de texto",
  select: "Seleccionar",
  number: "Número",
  signature: "Firma",
  date: "Fecha",
  checkbox: "Checkbox",
  instruction: "Instrucciones"
}

export const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  select: ChevronDown,
  number: Hash,
  signature: PenTool,
  date: Calendar,
  checkbox: ListChecks,
  instruction: Footprints
};