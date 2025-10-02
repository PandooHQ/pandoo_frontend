import type { ReactNode } from "react";
import { FormsContext } from "./FormsContext";
import { useMyForms } from "./useMyForm";

interface FormsProviderProps {
  children: ReactNode;
}

export const FormsProvider = ({ children }: FormsProviderProps) => {
  const {
    forms,
    setParams,
    updateForm,
    duplicateForm,
    isLoading,
    isError,
    fetchForms,
  } = useMyForms();

  return (
    <FormsContext.Provider
      value={{
        forms,
        updateForm,
        duplicateForm,
        setParams,
        isLoading,
        isError,
        fetchForms, // opcional
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
