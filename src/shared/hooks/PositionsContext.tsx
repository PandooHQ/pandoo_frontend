import { createContext } from "react";
import type { Position, PositionsContextType } from "../types/PositionsContextType";

const defaultValue: PositionsContextType = {
  positions: [],
  createPositions: async () => {
    return {} as Position;
  },
};

export const PositionContext = createContext<PositionsContextType>(defaultValue);
