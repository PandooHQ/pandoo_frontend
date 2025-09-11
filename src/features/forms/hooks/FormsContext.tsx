import { createContext } from "react"
import type { FormsContextType } from "../types/FormContextType"

export const FormsContext = createContext<FormsContextType | undefined>(undefined)
