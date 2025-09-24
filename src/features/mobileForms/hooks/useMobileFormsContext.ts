import { useContext } from "react"
import { MobileFormsContext } from "./MobileFormsContext"

export const useMobileFormsContext = () => {
  const ctx = useContext(MobileFormsContext)
  if (!ctx) {
    throw new Error("useMobileFormsContext debe usarse dentro de un MobileFormsProvider")
  }
  return ctx
}
