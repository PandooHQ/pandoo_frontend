/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ItemType } from "@/features/formBuilder/types/ItemType";
import type { SectionType } from "@/features/formBuilder/types/SectionType";
import type { Form } from "@/features/forms/types/FormNormalized";

export const denormalizeFormFromBackend = (backendForm: Form) => {
  return {
    id: backendForm.id!,
    title: backendForm.title,
    status: backendForm.status,
    description: backendForm.description,
    sections: (backendForm.steps || []).map(
      (step: any): SectionType => ({
        id: step.id,
        title: step.title,
        items: (step.inputs || []).map(
          (input: any): ItemType => ({
            id: input.id,
            label: input.label,
            type: input.type,
            required: input.required ?? false,
            // Normalizar opciones si existen
            options: input.options
              ? input.options.map((o: any) => ({
                  id: o.id,
                  label: o.name ?? o.label,
                }))
              : [],
            // Campos específicos
            placeholder: input.placeholder ?? null,
            minLength: input.min_length ?? null,
            maxLength: input.max_length ?? null,
          })
        ),
      })
    ),
  };
};
