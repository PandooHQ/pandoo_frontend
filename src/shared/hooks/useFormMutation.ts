import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useFormMutation(
  mutationFn: (variables: any) => Promise<any>, 
  lang: string
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate(`/${lang}/forms`);
    },
  });
}
