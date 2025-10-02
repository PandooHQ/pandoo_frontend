import type { ReactNode } from "react"
import { PositionContext } from "./PositionsContext"
import { usePositions } from "./usePositions"

export const PositionsProvider = ({ children }: { children: ReactNode }) => {
  const state = usePositions()
  return (
    <PositionContext.Provider value={state}>
      {children}
    </PositionContext.Provider>
  )
}
