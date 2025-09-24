import { type ReactNode, useEffect, useState } from "react";
import type { FormType } from "../types/FormType";
import { FormsContext } from "./FormsContext";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "../services/getForms";

export const FormsProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });

  const [forms, setForms] = useState<FormType[]>([]);

  // 1. Traemos datos de la API al inicio
  const { data, isLoading, isError } = useQuery<FormType[]>({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  useEffect(() => {
    if (data) {
      console.log(data)
      localStorage.setItem("forms", JSON.stringify(data));
      setForms(data);
    }
  }, [data]);

  // 3. Filtrado local en base a params
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
        form.status.toLowerCase().includes(params.status.toLowerCase())
      );
    }

    setForms(filteredForms);
  }, [params]);

  // 4. Acciones locales
  const removeForm = (id: number) => {
    setForms((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem("forms", JSON.stringify(updated));
      return updated;
    });
  };

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
      createdAt: new Date().toISOString(),
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
        removeForm,
        updateForm,
        duplicateForm,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
