import type { CreatePositionInput } from "../types/PositionsContextType";
import api from "./api";

export const createPosition = async(data: CreatePositionInput) => {

    const resp = await api.post('/positions', data);

    return resp.data

}