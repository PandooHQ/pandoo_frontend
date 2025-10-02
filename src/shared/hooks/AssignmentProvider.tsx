
import type { ReactNode } from "react"
import { AssignmentContext } from "./AssignmentContext"
import { useAssignments } from "./useAssignments"

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const { assignments, createAssignment } = useAssignments()
  return (
    <AssignmentContext.Provider value={{ assignments: assignments, createAssignment }}>
      {children}
    </AssignmentContext.Provider>
  )
}
