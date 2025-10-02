import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import type { Form } from "@/features/forms/types/FormNormalized";
import { editForm } from "../services/editForm";

interface FormPayload {
  form: Form;
}

export const useEditForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string, lang:string }>(); 

  return useMutation({
    mutationFn: (data: FormPayload) => {
      if (!id) throw new Error("No se encontró ID en la URL");
      return editForm(Number(id), data);
    },

    onSuccess: () => {
      console.log("aqui")
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", `${id}`] });

      navigate(`/${lang}/forms`);
    },

    onError: (error) => {
      console.error("Error al actualizar el formulario:", error);
    },
  });
};
