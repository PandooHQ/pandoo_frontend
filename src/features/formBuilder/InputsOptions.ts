import { ChevronDown, Hash, PenTool, Type } from "lucide-react";
import type { InputOptionType } from "./types/InputOptionType";

export const options: InputOptionType[] = [
  { id: "1", label: "Entrada de Texto", type: "text", icon: Type },
  { id: "2", label: "Seleccionar", type: "select", icon: ChevronDown },
  { id: "3", label: "Número", type: "number", icon: Hash },
  { id: "4", label: "Firma", type: "signature", icon: PenTool },
];
