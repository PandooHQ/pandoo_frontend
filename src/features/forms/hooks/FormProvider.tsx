import { type ReactNode, useEffect, useState } from "react";
import type { FormType } from "../types/FormType";
import { FormsContext } from "./FormsContext";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "../../../shared/api/getForms";

export const FormsProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });

  const [forms, setForms] = useState<FormType[]>([]);

  const { data, isLoading, isError } = useQuery<FormType[]>({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  useEffect(() => {
    if (data) {
      setForms(data);
    }
  }, [data]);

  useEffect(() => {
    const storedForms: FormType[] = JSON.parse(localStorage.getItem("forms") || "[]");

    let filteredForms = storedForms;

    if (params.search) {
      filteredForms = filteredForms.filter((form) =>
        form.title.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params.status) {
      filteredForms = filteredForms.filter((form) =>
        form?.status?.toLowerCase().includes(params.status.toLowerCase())
      );
    }

    setForms(filteredForms);
  }, [params]);

  
  const updateForm = (form: FormType) => {
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, ...form } : f))
    );
    localStorage.setItem("forms", JSON.stringify(forms));
  };

  const duplicateForm = (form: FormType) => {
    const storedForms: FormType[] = JSON.parse(
      localStorage.getItem("forms") || "[]"
    );

    const newId = Math.floor(Math.random() * 1000000);

    const clonedForm: FormType = {
      ...form,
      id: newId,
      title: `${form.title} (copia)`,
      created_at: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      responses: 0,
      sections: form?.sections?.map((section) => ({
        ...section,
        id: `${section.id}-${newId}`,
        items: section.items.map((item) => ({ ...item })),
      })),
    };

    storedForms.push(clonedForm);
    localStorage.setItem("forms", JSON.stringify(storedForms));

    setForms(storedForms);
  };

  return (
    <FormsContext.Provider
      value={{
        forms,
        isLoading,
        isError,
        setParams,
        updateForm,
        duplicateForm,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
