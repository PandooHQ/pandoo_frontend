import { ChevronDown, Hash, PenTool, Type, Calendar, ListChecks, Footprints, Clock3 } from "lucide-react";
import type { InputOptionType } from "./types/InputOptionType";

export const options: InputOptionType[] = [
  { id: "6", label: "Checkbox", type: "checkbox", icon: ListChecks },
  { id: "1", label: "Entrada de Texto", type: "text", icon: Type },
  { id: "4", label: "Firma", type: "signature", icon: PenTool },
  { id: "5", label: "Fecha", type: "date", icon: Calendar },
  { id: "7", label: "Hora", type: "time", icon: Clock3 },
  { id: "8", label: "Instrucciones", type: "instruction", icon: Footprints },
  { id: "3", label: "Número", type: "number", icon: Hash },
  { id: "2", label: "Seleccionar", type: "select", icon: ChevronDown },
];
