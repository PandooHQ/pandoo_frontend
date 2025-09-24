import { useState, useMemo, useEffect } from "react";
import { type MobileForm } from "../types/MobileFormType";

const formInstances: MobileForm[] = [
  { id: 1, title: "Formulario Maquinaria - ID 01", type: "maquinaria", status: "completed", created_at: "2024-01-15" },
  { id: 2, title: "Formulario Maquinaria - ID 02", type: "maquinaria", status: "in_progress", created_at: "2024-01-15" },
  { id: 3, title: "Formulario Maquinaria - ID 03", type: "maquinaria", status: "completed", created_at: "2024-01-14" },
  { id: 4, title: "Formulario Seguridad - ID 04", type: "seguridad", status: "in_progress", created_at: "2024-01-16" },
  { id: 5, title: "Formulario Mantenimiento - ID 05", type: "mantenimiento", status: "in_progress", created_at: "2024-01-13" },
];

export const useMobileForms = () => {
  const [mobileForms] = useState<MobileForm[]>(formInstances);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredForms = useMemo(() => {
    return mobileForms.filter((form) => {
      const matchesSearch =
        searchTerm === "" ||
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.id.toString().includes(searchTerm);

      const matchesStatus =
        selectedStatus === "all" || form.status === selectedStatus;

      const matchesType =
        selectedType === "all" || form.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [mobileForms, searchTerm, selectedStatus, selectedType]);

  useEffect(() => {
    console.log(filteredForms)
  
  }, [searchTerm])
  

  return {
    mobileForms,
    filteredForms,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
  };
};
