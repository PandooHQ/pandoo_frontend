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
    console.log("aqui")
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

  return (
    <FormsContext.Provider
      value={{ forms, removeForm, updateForm, setParams, fetchForms }}
    >
      {children}
    </FormsContext.Provider>
  );
};
