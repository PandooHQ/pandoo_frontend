import type { Dispatch, SetStateAction } from "react";
import type { FormType } from "./FormType";

export interface FormsContextType {
  forms: FormType[];
  removeForm: (id: number) => void;
  updateForm: (form: FormType) => void;
  setParams: Dispatch<
    SetStateAction<{
      page: number;
      per_page: number;
      search: string;
      status: string;
    }>
  >;
  fetchForms?: () => void;
  duplicateForm: (form:FormType) => void;
  isLoading : boolean;
  isError: boolean,
}
