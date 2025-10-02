import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { Form } from "@/features/forms/types/FormNormalized";
import { editForm } from "../services/editForm";

interface FormPayload {
  form: Form;
}

export const useEditForm = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string, lang:string }>(); 

  return useMutation({
    mutationFn: (data: FormPayload) => {
      if (!id) throw new Error("No se encontró ID en la URL");
      return editForm(Number(id), data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", `${id}`] });
    },

    onError: (error) => {
      console.error("Error al actualizar el formulario:", error);
    },
  });
};
