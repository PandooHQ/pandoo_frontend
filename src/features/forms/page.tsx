import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { FormCards } from "./components/FormsCard";
import { useMyForms } from "./hooks/useMyForm";

export default function FormPage() {
  const { forms, setParams } = useMyForms();

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between flex-col lg:flex-row">
        <div> 
          <h1 className="text-2xl font-semibold tracking-tight">
            Mis Formularios
          </h1>
          <p className="text-muted-foreground">
            Gestiona y organiza todos tus formularios en un solo lugar
          </p>
        </div>

        <div className="flex justify-end w-full lg:w-auto mt-4 lg:mt-0">
          <div className="flex gap-2">
            <Link to="bulk-assignment">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Asignación Masiva
              </Button>
            </Link>
            <Link to="blank">
              <Button>
                <Plus className="md:mr-2 h-4 w-4" />
                Nuevo Formulario
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-col lg:flex-row">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar formularios..."
            className="pl-9 w-full"
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                search: (e.target as HTMLInputElement).value,
              }))
            }
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                status: "",
              }))
            }
          >
            Todos los Formularios
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                status: "published",
              }))
            }
          >
            Publicados
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((prev) => ({
                ...prev,
                status: "draft",
              }))
            }
          >
            Borradores
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 grid-cols-1">
        <Link to="blank">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center p-6 min-h-[150px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">
                Crear Nuevo Formulario
              </h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Comienza a construir un formulario desde cero
              </p>
            </CardContent>
          </Card>
        </Link>

        <FormCards forms={forms} />
      </div>
    </div>
  );
}
