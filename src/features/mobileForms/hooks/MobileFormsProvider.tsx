import type { ReactNode } from "react"
import { MobileFormsContext } from "./MobileFormsContext"
import { useMobileForms } from "./useMobileForms"

export const MobileFormsProvider = ({ children }: { children: ReactNode }) => {
  const state = useMobileForms()
  return (
    <MobileFormsContext.Provider value={state}>
      {children}
    </MobileFormsContext.Provider>
  )
}
