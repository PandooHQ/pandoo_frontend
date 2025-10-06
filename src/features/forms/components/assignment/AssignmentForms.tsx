import { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { CheckCircle, Search } from "lucide-react";
import type { FormType } from "../../types/FormType";

interface Props {
  forms: FormType[];
  selectedFormForAssignment: string;
  setSelectedFormForAssignment: (id: string) => void;
}

const AssignmentForms: React.FC<Props> = ({
  forms,
  selectedFormForAssignment,
  setSelectedFormForAssignment,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 5;

  const filteredForms = useMemo(() => {
    if (!searchTerm.trim()) return forms;
    const term = searchTerm.toLowerCase();
    return forms.filter(
      (form) =>
        form.title.toLowerCase().includes(term) ||
        form.description?.toLowerCase().includes(term)
    );
  }, [forms, searchTerm]);

  const totalPages = Math.ceil(filteredForms.length / formsPerPage);
  const startIndex = (currentPage - 1) * formsPerPage;
  const currentForms = filteredForms.slice(startIndex, startIndex + formsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Selecciona un formulario para asignar</CardTitle>
        <CardDescription>
          Elige el formulario que quieras asignar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Busca formularios..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {currentForms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {currentForms.map((form) => (
                <Card
                  key={form.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-2 text-wrap ${
                    selectedFormForAssignment === form.id!.toString()
                      ? "border-primary bg-muted shadow-md"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() =>
                    setSelectedFormForAssignment(form.id!.toString())
                  }
                >
                  <CardHeader className="pb-2 px-3 pt-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight break-words whitespace-normal">
                          {form.title}
                        </h4>
                      </div>
                      {selectedFormForAssignment === form.id!.toString() && (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 ml-1" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 pt-0">
                    <p className="text-xs text-muted-foreground break-words whitespace-normal">
                      {form.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm pt-4">
              No se encontraron formularios que coincidan con tu búsqueda.
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredForms.length > 0 ? startIndex + 1 : 0}–
              {Math.min(startIndex + formsPerPage, filteredForms.length)} de{" "}
              {filteredForms.length} formularios
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentForms;
