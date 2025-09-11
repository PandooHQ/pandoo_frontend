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

  const [allForm] = useState<FormType[]>([
    {
      id: 1,
      title: "Formulario de Control de Maquinaria",
      description:
        "Formulario diario de inspección y control de maquinaria para equipos de construcción",
      status: "published",
      createdAt: "2024-01-15",
      responses: 24,
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      title: "Encuesta de Retroalimentación de Empleados",
      description:
        "Formulario mensual de satisfacción y recolección de comentarios de empleados",
      status: "draft",
      createdAt: "2024-01-10",
      responses: 0,
      lastModified: "2024-01-18",
    },
    {
      id: 3,
      title: "Registro de Clientes",
      description: "Formulario de incorporación y registro de nuevos clientes",
      status: "published",
      createdAt: "2024-01-05",
      responses: 156,
      lastModified: "2024-01-15",
    },
    {
      id: 4,
      title: "Evaluación de Proyecto",
      description:
        "Formulario de evaluación y valoración de finalización de proyecto",
      status: "draft",
      createdAt: "2023-12-20",
      responses: 45,
      lastModified: "2024-01-10",
    },
  ]);

  const [forms, setForms] = useState<FormType[]>(allForm);

  useEffect(() => {
    console.log(params);
  }, [params]);

  useEffect(() => {
    const fetchForms = async () => {
      try {

        if (params.search) {
          setForms(
            allForm.filter((form) =>
              form.title.toLowerCase().includes(params.search.toLowerCase())
            )
          );
        } else {
          setForms(allForm);
        }

        if (params.status != "") {
          setForms(
            allForm.filter((form) =>
              form.status.toLowerCase().includes(params.status.toLowerCase())
            )
          );
        } else {
          setForms(allForm);
        }
      } catch (error) {
        console.error(error);
        setForms([]);
      }
    };

    fetchForms();
  }, [params.page, params.search, allForm, params.status]);

  const addForm = (form: FormType) => {
    setForms((prev) => [...prev, form]);
  };

  const removeForm = (id: number) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
  };

  const updateForm = (form: FormType) => {
    setForms((prev) =>
      prev.map((f) => (f.id === form.id ? { ...f, ...form } : f))
    );
  };

  return (
    <FormsContext.Provider
      value={{ forms, addForm, removeForm, updateForm, setParams }}
    >
      {children}
    </FormsContext.Provider>
  );
};
