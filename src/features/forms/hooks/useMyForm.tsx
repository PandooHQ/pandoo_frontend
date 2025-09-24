import { useContext } from "react";
import { FormsContext } from "./FormsContext";

export const useMyForms = () => {
  const context = useContext(FormsContext);
  
  if (!context) {
    throw new Error("useForms debe usarse dentro de un FormsProvider");
  }

   const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return status?.charAt(0)?.toUpperCase() + status?.slice(1);
    }
  };

  return {
    ...context,
    getStatusColor,
    getStatusLabel
  };
};
