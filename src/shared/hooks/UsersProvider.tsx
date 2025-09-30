import type { ReactNode } from "react"
import { UsersContext } from "./UsersContext"
import { useUsers } from "./useUsers"

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const state = useUsers()
  return (
    <UsersContext.Provider value={state}>
      {children}
    </UsersContext.Provider>
  )
}
