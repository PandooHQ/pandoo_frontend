export interface PositionsContextType {
    positions: Position[];
    createPositions: (position: CreatePositionInput) => Promise<Position>;
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
