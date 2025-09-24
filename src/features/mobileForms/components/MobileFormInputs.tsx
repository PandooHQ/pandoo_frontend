import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useMobileFormsContext } from "../hooks/useMobileFormsContext";
import { Search } from "lucide-react";

export const MobileFormInputs = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
  } = useMobileFormsContext();

  const statuses = [
    { value: "all", label: "Todos los estados" },
    { value: "in_progress", label: "En Progreso" },
    { value: "completed", label: "Completado" },
  ];

  const formTypes = [
    { value: "all", label: "Todos los tipos" },
    { value: "maquinaria", label: "Maquinaria" },
    { value: "seguridad", label: "Seguridad" },
    { value: "mantenimiento", label: "Mantenimiento" },
  ];

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar formularios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-10 flex-1">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {formTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-10 flex-1">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
