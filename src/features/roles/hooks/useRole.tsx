import { useQuery } from "@tanstack/react-query";
import { getRole } from "../services/getRole";
import type { Role } from "../types/RolesType";

export const useRole = (id: number) => {
  const { data, isLoading } = useQuery<Role>({
    queryKey: ["role", `${id}`],
    queryFn: () => getRole(id),
  });

  return { data, isLoading };
};