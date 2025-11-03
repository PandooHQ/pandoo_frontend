import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormType } from "../types/FormType";
import { getForms } from "@/shared/api/getForms";
import { useMemo, useState } from "react";
import { getForm } from "../services/getForm";
import { createForm } from "@/features/formBuilder/services/createForm";
import { toast } from "sonner";

export const useMyForms = () => {
  const queryClient = useQueryClient();

  const {
    data: forms = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<FormType[]>({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });

  const filteredForms = useMemo(() => {
    let result = [...forms];

    if (params.search) {
      result = result.filter((form) =>
        form.title.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params.status) {
      result = result.filter((form) =>
        form?.status?.toLowerCase().includes(params.status.toLowerCase())
      );
    }

    return result;
  }, [forms, params]);

  const updateForm = (form: FormType) => {
    queryClient.setQueryData<FormType[]>(["forms"], (old = []) =>
      old.map((f) => (f.id === form.id ? { ...f, ...form } : f))
    );
  };

  const duplicateForm = async (form: FormType) => {
    try {
      const originalForm = await getForm(form.id);
      const data = originalForm.data;

      type InputAttribute = {
        label: string;
        name: string;
        position: number;
        input_config_type: string;
        input_config_attributes: {
          required: boolean;
        };
      };

      type StepAttribute = {
        title: string;
        position: number;
        inputs_attributes: Record<number, InputAttribute>;
      };

      const steps_attributes = data.steps?.reduce(
        (
          acc: Record<number, StepAttribute>,
          step: {
            title: string;
            position: number;
            inputs?: Array<{
              label: string;
              name: string;
              position: number;
              input_config_type: string;
              required?: boolean;
            }>;
          },
          stepIndex: number
        ) => {
          acc[stepIndex] = {
            title: step.title,
            position: step.position,
            inputs_attributes: step.inputs?.reduce(
              (
                inputsAcc: Record<number, InputAttribute>,
                input: {
                  label: string;
                  name: string;
                  position: number;
                  input_config_type: string;
                  required?: boolean;
                },
                inputIndex: number
              ) => {
                inputsAcc[inputIndex] = {
                  label: input.label,
                  name: input.name,
                  position: input.position,
                  input_config_type: input.input_config_type,
                  input_config_attributes: {
                    required: input.required ?? false,
                  },
                };
                return inputsAcc;
              },
              {} as Record<number, InputAttribute>
            ) ?? {},
          };
          return acc;
        },
        {} as Record<number, StepAttribute>
      );

      const payload = {
        title: `${data.title} (copia)`,
        description: data.description,
        status: "draft",
        steps_attributes,
      };

      const sendForm = {
        form: payload,
      }

      const newForm = await createForm(sendForm);

      await queryClient.invalidateQueries({ queryKey: ["forms"] });

      toast.success(`Se duplico el formulario ${data.title} correctamente`)

      return newForm;
    } catch (error) {
      console.error("Error duplicando el formulario:", error);
    }
  };

  return {
    forms: filteredForms,
    params,
    setParams,
    updateForm,
    duplicateForm,
    isLoading,
    isError,
    fetchForms: refetch,
  };
};
