import { createContext } from "react"
import { useMobileForms } from "../hooks/useMobileForms"

export const MobileFormsContext = createContext<ReturnType<typeof useMobileForms> | null>(null)