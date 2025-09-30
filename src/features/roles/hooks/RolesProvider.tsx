import type { ReactNode } from "react"
import { useRoles } from "./useRoles"
import { RolesContext } from "./RolesContext"

export const RolesProvider = ({ children }: { children: ReactNode }) => {
  const state = useRoles()
  return (
    <RolesContext.Provider value={state}>
      {children}
    </RolesContext.Provider>
  )
}
