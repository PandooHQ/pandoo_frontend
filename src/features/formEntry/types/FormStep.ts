import type { FormInputField } from "./FormInputFIeld";

export type FormStep = {
  id?: number;
  title?: string;
  inputs: FormInputField[];
};
