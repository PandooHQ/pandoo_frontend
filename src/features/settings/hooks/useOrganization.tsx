import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrganization } from "../services/getOrganization";
import { updateOrganization } from "../services/updateOrganization";

export const useOrganization = () => {

  const queryClient = useQueryClient();
  
  const { data } = useQuery({
    queryKey: ["organization"],
    queryFn: () => getOrganization(),
  });

  const updateOrganizationMutation = useMutation({
    mutationKey: ["createPosition"],
    mutationFn: (userData: FormData) => updateOrganization(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    }
  });

  return {
    organization: data,
    updateOrganization: updateOrganizationMutation.mutateAsync,
  };
};
