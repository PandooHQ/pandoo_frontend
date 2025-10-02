import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getFormResponseUser } from "../api/getFormResponseUser";
import { createFormResponseUser } from "../api/createFormReponseUser";
import type { CreateAssignmentInput } from "../types/AssignmentContextType";

export const useAssignments = () => {

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["assignments"],
    queryFn: ()=> getFormResponseUser()
  })

  const createAssignmentMutation = useMutation({
    mutationKey: ["createAssignment"],
    mutationFn: ({ user_id, id }: CreateAssignmentInput) =>
      createFormResponseUser({user_id, id}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    }
  })

  return {
    assignments : data?.data || [],
    createAssignment: createAssignmentMutation.mutateAsync,
  }
}
