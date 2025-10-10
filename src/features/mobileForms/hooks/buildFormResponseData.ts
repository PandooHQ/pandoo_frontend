import type { FormAssignment, Input, Step } from "@/features/formEntry/types/FormAssignment";
import type { FormResponse } from "@/features/formEntry/types/FormResponse";


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
          const selectedValues = Array.isArray(value) ? value : [value];
          
          answer = { values: selectedValues };
        } else {
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
