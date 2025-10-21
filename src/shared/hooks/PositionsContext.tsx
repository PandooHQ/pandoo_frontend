import { createContext } from "react";
import type { PositionResp, PositionsContextType } from "../types/PositionsContextType";

const defaultValue: PositionsContextType = {
  positions: [],
  createPositions: async () => {
    return {} as PositionResp;
  },
};

export const PositionContext = createContext<PositionsContextType>(defaultValue);
