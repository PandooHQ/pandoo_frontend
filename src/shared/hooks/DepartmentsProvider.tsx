import type { ReactNode } from "react"
import { DepartmentsContext } from "./DepartmentsContext"
import { useDepartments } from "./useDepartments"

export const DepartmentsProvider = ({ children }: { children: ReactNode }) => {
  const state = useDepartments()
  return (
    <DepartmentsContext.Provider value={state}>
      {children}
    </DepartmentsContext.Provider>
  )
}
