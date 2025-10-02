import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from "../api/getUsers";
import { updateUser } from "../api/updateUser";
import type { CreateUserInput, UpdateUserInput } from "../types/UsersContextType";
import { createUser } from "../api/createUser";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const updateUserMutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (userData: UpdateUserInput) =>
      updateUser(userData.id, userData ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const createUserMutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (userData: CreateUserInput) =>
      createUser(userData ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  return {
    users: users?.data || [],
    updateUser: updateUserMutation.mutateAsync,
    createUser: createUserMutation.mutateAsync,
  };
};
