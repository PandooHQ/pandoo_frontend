import type { ReactNode } from "react"
import { OrganizationContext } from "./OrganizationContext"
import { useOrganization } from "./useOrganization"

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const state = useOrganization()
  return (
    <OrganizationContext.Provider value={state}>
      {children}
    </OrganizationContext.Provider>
  )
}
