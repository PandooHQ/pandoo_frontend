import { useEffect, useState, type ReactNode } from "react";
import type { FormType } from "../types/FormType";
import { FormsContext } from "./FormsContext";

export const FormsProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });

  const [allForm, setAllForm] = useState<FormType[]>([]);

  const [forms, setForms] = useState<FormType[]>(allForm);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    setAllForm(storedForms);
    setForms(storedForms);
  }, []);

  useEffect(() => {
    fetchForms();
  }, [params.page, params.search, params.status]);

  const fetchForms = () => {
    try {
      const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
      setAllForm(storedForms);

      let filteredForms = storedForms;

      if (params.search) {
        filteredForms = filteredForms.filter((form: FormType) =>
          form.title.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      if (params.status) {
        filteredForms = filteredForms.filter((form: FormType) =>
          form.status.toLowerCase().includes(params.status.toLowerCase())
        );
      }

      setForms(filteredForms);
    } catch (error) {
      console.error(error);
      setForms([]);
    }
  };

  const removeForm = (id: number) => {
    console.log("aqui");
    setForms((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem("forms", JSON.stringify(updated));
      return updated;
    });

    setAllForm((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      return updated;
    });
  };

  const updateForm = (form: FormType) => {
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, ...form } : f))
    );
  };

  const duplicateForm = (form: FormType) => {
    const storedForms: FormType[] = JSON.parse(
      localStorage.getItem("forms") || "[]"
    );

    // Crear un nuevo id (puede ser timestamp o random)
    const newId = Math.floor(Math.random() * 1000000);

    // Clonar el form con nuevo id y título modificado
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

    fetchForms();
  };

  return (
    <FormsContext.Provider
      value={{ forms, removeForm, updateForm, setParams, fetchForms, duplicateForm }}
    >
      {children}
    </FormsContext.Provider>
  );
};
