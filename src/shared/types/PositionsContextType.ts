export interface PositionsContextType {
    positions: Position[];
    createPositions: (position: CreatePositionInput) => Promise<PositionResp>;
}

export interface PositionResp {
    data: {
        id: number,
        name: string
    }
}
export interface Position {
    id:          number;
    name:        string;
}

export type CreatePositionInput = {
    name: string;
    id?: string;
};

export type UpdatePositionInput = Partial<
  Omit<Position, "id">
> & { id: string };
