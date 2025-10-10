import type { FormAssignment, Input, Step } from "../types/FormAssignment";
import type { FormResponse } from "../types/FormResponse";

export const buildFormResponseData = (
  form: FormAssignment,
  formData: Record<string, unknown>,
  status: string = "draft"
): FormResponse => {
  const answers = form.steps.flatMap((step: Step) =>
    step.inputs
      .filter(
        (input: Input) =>
          formData[input.name] !== undefined && formData[input.name] !== ""
      )
      .map((input: Input) => {
        const value = formData[input.name];
        let answer: Record<string, unknown>;

        if (input.type === "select") {
          // ✅ Si el campo es múltiple, puede ser un array
          const selectedValues = Array.isArray(value) ? value : [value];

          // Buscar los IDs correspondientes a los valores seleccionados
          const selectedIds =
            input.options
              ?.filter((opt) => selectedValues.includes(opt.value))
              .map((opt) => opt.id) ?? [];

          answer = { values: selectedIds };
        } else {
          // Otros tipos usan "value"
          answer = { value };
        }

        return {
          form_input_id: input.id,
          answer: {
            type: input.type,
            ...answer,
          },
        };
      })
  );

  return {
    form_assignment_id: form.id,
    status,
    answers,
  };
};
