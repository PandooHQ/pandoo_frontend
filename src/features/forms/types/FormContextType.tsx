import type { Dispatch, SetStateAction } from 'react';
import type { FormType } from './FormType';

export interface FormsContextType {
  forms: FormType[]
  addForm: (form: FormType) => void
  removeForm: (id: number) => void
  updateForm: (form: FormType) => void
  setParams: Dispatch<SetStateAction<{ page: number; per_page: number; search: string, status: string }>>
}