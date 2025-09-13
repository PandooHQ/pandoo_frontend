import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BarChart3, FileText, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActions() {

  return (
    <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription>Comienza con estas tareas comunes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="forms/blank">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 w-full hover:bg-blue-50 hover:border-blue-200 bg-transparent"
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Crear Formulario</div>
                  <div className="text-xs text-muted-foreground text-wrap">
                    Construye nuevos formularios de recolección de datos
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="forms">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 w-full hover:bg-green-50 hover:border-green-200 bg-transparent"
              >
                <BarChart3 className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Ver Formularios</div>
                  <div className="text-xs text-muted-foreground">
                    Gestiona formularios existentes
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="personnel">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 w-full hover:bg-purple-50 hover:border-purple-200 bg-transparent"
              >
                <Users className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Gestionar Personal</div>
                  <div className="text-xs text-muted-foreground">
                    Agregar y gestionar usuarios
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="dashboard">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 w-full hover:bg-orange-50 hover:border-orange-200 bg-transparent"
              >
                <BarChart3 className="h-6 w-6 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Datos De Formularios</div>
                  <div className="text-xs text-muted-foreground">
                    Análisis e información
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
  );
}