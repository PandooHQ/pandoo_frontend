import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPositions } from "../api/getPositions";
import type { CreatePositionInput } from "../types/PositionsContextType";
import { createPosition } from "../api/createPositions";

export const usePositions = () => {

  const queryClient = useQueryClient();
  
  const { data } = useQuery({
    queryKey: ["positions"],
    queryFn: () => getPositions(),
  });

  const createPositionMutation = useMutation({
    mutationKey: ["createPosition"],
    mutationFn: (userData: CreatePositionInput) => createPosition(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    }
  });

  return {
    positions: data || [],
    createPositions: createPositionMutation.mutateAsync,
  };
};
