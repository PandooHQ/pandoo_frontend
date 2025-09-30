import { useMutation, useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/getUsers";
import { updateUser } from "../api/updateUser";
import type { UpdateUserInput } from "../types/UsersContextType";

export const useUsers = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const updateUserMutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (userData: UpdateUserInput) =>
      updateUser(userData.id, { user: userData }),
  });

  return {
    users: users?.data || [],
    updateUser: updateUserMutation.mutateAsync,
  };
};
