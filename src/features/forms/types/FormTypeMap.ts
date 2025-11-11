import { ChevronDown, Hash, PenTool, Type, Calendar, ListChecks, Footprints, Clock3 } from "lucide-react";

export const typeMap: Record<string, string> = {
  text: "InputConfigs::TextInput",
  select: "InputConfigs::SelectInput",
  signature: "InputConfigs::SignatureInput",
  number: "InputConfigs::NumberInput",
  date: "InputConfigs::DatetimeInput",
  checkbox: "InputConfigs::CheckboxInput",
  instruction: "InputConfigs::InstructionsInput",
  time: "InputConfigs::DatetimeInput",
};

export const typeActiveId : Record<string, string> = {
  text: "Entrada de texto",
  select: "Seleccionar",
  number: "Número",
  signature: "Firma",
  date: "Fecha",
  checkbox: "Checkbox",
  instruction: "Instrucciones",
  time: "Hora"
}

export const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  select: ChevronDown,
  number: Hash,
  signature: PenTool,
  date: Calendar,
  checkbox: ListChecks,
  instruction: Footprints,
  time: Clock3
};

export const typeLabels: Record<string, string> = {
  instructions: "Bloque de instrucciones",
  signature: "Campo de firma",
  select: "Campo de selección",
  number: "Campo numérico",
  text: "Campo de texto",
  date: "Campo fecha",
  instruction: "Campo instrucciones",
  time: "Campo hora",
  checkbox: "Campo checkbox",
};