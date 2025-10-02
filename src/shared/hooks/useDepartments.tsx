import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartments } from "../api/getDepartments";
import { createDepartments } from "../api/createDepartments";
import type { CreateDeparmentInput } from "../types/DepartmentsContextType";

export const useDepartments = () => {
  const queryClient = useQueryClient();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments(),
  });

  const createDeparmentMutation = useMutation({
    mutationKey: ["createDepartment"],
    mutationFn: (userData: CreateDeparmentInput) =>
      createDepartments( userData ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    }
  });

  return {
    departments: departments || [],
    createDepartment: createDeparmentMutation.mutateAsync,
  };
};
