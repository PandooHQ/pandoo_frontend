import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GettingStarted() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comenzando con Pandoo</CardTitle>
        <CardDescription>
          Sigue estos pasos para configurar tu flujo de trabajo de recolección
          de datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-medium">Crea tu Primer Formulario</h4>
              <p className="text-sm text-muted-foreground">
                Diseña formularios personalizados para tus necesidades de
                recolección de datos
              </p>
              <Link
                to="forms/blank"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
              >
                Comenzar a crear <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-medium">Ingresa tu personal</h4>
              <p className="text-sm text-muted-foreground">
                Crea tu personal y asignales formularios
              </p>
              <Link
                to="personnel"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
              >
                Gestionar personal <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-medium">Monitorea el Progreso</h4>
              <p className="text-sm text-muted-foreground">
                Rastrea envíos y analiza tendencias de datos
              </p>
              <Link
                to="dashboard"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
              >
                Ver panel de control <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
