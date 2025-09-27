import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Form } from "@/features/forms/types/FormNormalized";
import { editForm } from "../services/editForm";

type FormWithRaw = Form & {
  form: unknown;
};

export const useEditForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormWithRaw }) =>
      editForm(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },

    onError: (error) => {
      console.error("Error al actualizar el formulario:", error);
    },  
  });
};
