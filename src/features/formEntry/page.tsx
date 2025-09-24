import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";

// Mock assigned forms data - using the machinery control form as the main example
const assignedForms = [
  {
    id: "1",
    title: "Formulario de Control de Maquinaria",
    description:
      "Formulario diario de control de operación y mantenimiento de maquinaria",
    type: "maquinaria",
    status: "pending",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-20",
    priority: "high",
    estimatedTime: "15-20 min",
  },
  {
    id: "2",
    title: "Formulario de Seguridad",
    description:
      "Inspección diaria de protocolos de seguridad en el sitio de trabajo",
    type: "seguridad",
    status: "in_progress",
    assignedDate: "2024-01-14",
    dueDate: "2024-01-19",
    priority: "medium",
    estimatedTime: "10-15 min",
  },
  {
    id: "3",
    title: "Formulario de Mantenimiento",
    description: "Reporte semanal de mantenimiento preventivo de equipos",
    type: "mantenimiento",
    status: "pending",
    assignedDate: "2024-01-13",
    dueDate: "2024-01-18",
    priority: "low",
    estimatedTime: "20-25 min",
  },
];

export default function FormEntryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForms = assignedForms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Formularios Asignados
          </h1>
          <p className="text-muted-foreground">
            Completa los formularios que te han sido asignados
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"></div>
      </div>

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

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg leading-snug break-words hyphens-auto">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2 break-words">
                    {form.description}
                  </CardDescription>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Link to={`/forms/entry/${form.id}`}>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm py-2.5">
                  Nuevo Registro
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron formularios
            </h3>
            <p className="text-muted-foreground">
              Intenta ajustar tu búsqueda o filtros para encontrar formularios
              asignados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
