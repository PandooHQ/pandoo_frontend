import type { Input } from "./FormInputsTypes";

interface Step {
  inputs_attributes: Input[];
  title: string;
  position: number;
}

export interface Form {
  id?: number;
  title: string;
  description?: string;
  steps_attributes: Step[];
  steps?: Step[]
  status?: "draft" | "published"
}