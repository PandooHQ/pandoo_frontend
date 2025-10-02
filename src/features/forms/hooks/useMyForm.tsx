import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormType } from "../types/FormType";
import { getForms } from "@/shared/api/getForms";
import { useMemo, useState } from "react";

export const useMyForms = () => {
  const queryClient = useQueryClient();

  const {
    data: forms = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<FormType[]>({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });

  const filteredForms = useMemo(() => {
    let result = [...forms];

    if (params.search) {
      result = result.filter((form) =>
        form.title.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params.status) {
      result = result.filter((form) =>
        form?.status?.toLowerCase().includes(params.status.toLowerCase())
      );
    }

    return result;
  }, [forms, params]);

  const updateForm = (form: FormType) => {
    queryClient.setQueryData<FormType[]>(["forms"], (old = []) =>
      old.map((f) => (f.id === form.id ? { ...f, ...form } : f))
    );
  };

  const duplicateForm = (form: FormType) => {
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

    queryClient.setQueryData<FormType[]>(["forms"], (old = []) => [
      ...old,
      clonedForm,
    ]);
  };

  return {
    forms: filteredForms,
    params,
    setParams,
    updateForm,
    duplicateForm,
    isLoading,
    isError,
    fetchForms: refetch,
  };
};
