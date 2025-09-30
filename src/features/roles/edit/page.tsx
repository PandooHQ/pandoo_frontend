import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Save, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockPermissions = [
  { id: "view", name: "Ver", description: "Puede ver formularios y datos" },
  {
    id: "create",
    name: "Crear",
    description: "Puede crear nuevos formularios",
  },
  { id: "delete", name: "Eliminar", description: "Puede eliminar formularios" },
  {
    id: "complete",
    name: "Completar",
    description: "Puede llenar formularios",
  },
  {
    id: "manage_users",
    name: "Gestionar Usuarios",
    description: "Puede gestionar cuentas de usuario",
  },
  {
    id: "view_reports",
    name: "Ver Reportes",
    description: "Puede acceder a reportes y análisis",
  },
];

const mockRole = {
  id: 1,
  name: "Administrator",
  description: "Full system access and management capabilities",
  permissions: [
    "view",
    "create",
    "edit",
    "delete",
    "manage_users",
    "view_reports",
  ],
};

export default function EditRolePage() {
  const router = useNavigate();
  // const params = useParams()
  const [role, setRole] = useState(mockRole);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    mockRole.permissions
  );

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSave = () => {
    // In a real app, you would save the changes to the backend here
    console.log("Saving role:", { ...role, permissions: selectedPermissions });
    router("/roles");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar Rol: {role.name}
          </h1>
          <p className="text-muted-foreground">
            Modificar detalles del rol y permisos
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Detalles del Rol
            </CardTitle>
            <CardDescription>Información básica del rol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Nombre del Rol</Label>
              <Input
                id="role-name"
                value={role.name}
                onChange={(e) => setRole({ ...role, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Descripción</Label>
              <Textarea
                id="role-description"
                value={role.description}
                onChange={(e) =>
                  setRole({ ...role, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permisos del Rol</CardTitle>
            <CardDescription>
              Selecciona los permisos para este rol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.id, checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
