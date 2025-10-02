import type { Position } from "../types/PositionsContextType";
import api from "./api";

export const getPositions = async(): Promise<Position[]> => {
    const resp = await api.get('/positions');
    return resp.data.data;
}