import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserResponses } from "../services/getUserResponses";
import type { MobileForm } from "../types/MobileFormType";

export const useMobileForms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: mobileForms = [] } = useQuery({
    queryKey: ["form_responses"],
    queryFn: () => getUserResponses(),
  });

  const filteredForms = useMemo(() => {
    return mobileForms.filter((form:MobileForm) => {
      const matchesSearch =
        searchTerm === "" ||
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.id.toString().includes(searchTerm);

      const matchesStatus =
        selectedStatus === "all" || form.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [mobileForms, searchTerm, selectedStatus, selectedType]);

  useEffect(() => {
    console.log(filteredForms);
  }, [filteredForms]);

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
