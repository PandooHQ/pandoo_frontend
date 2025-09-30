import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PermissionType } from "../../types/PermissionType";

interface Props {
    mockPermissions: PermissionType[];
    handlePermissionSelect: (permissionId: string, isSelected: boolean) => void;
    selectedPermissions: string[];
    setCurrentStep: (step: number) => void;
}

export const PermissionsConfiguration = ({
  mockPermissions,
  handlePermissionSelect,
  selectedPermissions,
  setCurrentStep,
} : Props) => {
  const router = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos del Rol</CardTitle>
        <CardDescription>
          Selecciona los permisos que tendrá este rol. Para el MVP, estos
          permisos se aplican globalmente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPermissions.map((permission : PermissionType) => (
            <div
              key={permission.id}
              className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={(checked) =>
                  handlePermissionSelect(permission.id, checked as boolean)
                }
              />
              <div className="flex-1">
                <Label
                  htmlFor={permission.id}
                  className="font-medium cursor-pointer"
                >
                  {permission.name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {permission.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => router("/roles")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Roles
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={selectedPermissions.length === 0}
          >
            Siguiente: Asignar Usuarios
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
