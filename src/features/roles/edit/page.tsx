import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "../hooks/useRole";

// 🔹 Esta lista debería venir de un endpoint, pero la hardcodeamos aquí por ahora
// const allPermissions = [
//   {
//     subject: "User",
//     actions: ["assign_roles", "manage", "create", "read", "update", "destroy"],
//   },
//   {
//     subject: "Form",
//     actions: [
//       "publish",
//       "unpublish",
//       "duplicate",
//       "manage",
//       "create",
//       "read",
//       "update",
//       "destroy",
//     ],
//   },
//   {
//     subject: "FormResponse",
//     actions: ["manage", "create", "read", "update", "destroy"],
//   },
//   {
//     subject: "Role",
//     actions: ["manage", "create", "read", "update", "destroy"],
//   },
//   {
//     subject: "Permission",
//     actions: ["manage", "create", "read", "update", "destroy"],
//   },
// ];


const allPermissions = [
  {
    subject: "User",
    actions: ["manage"],
  },
  {
    subject: "FormResponse",
    actions: ["create", "read", "update"],
  },
];

export default function EditRolePage() {
  const router = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: roleData } = useRole(Number(id) || 0);

  const [role, setRole] = useState({
    id: 0,
    name: "",
    description: "",
    permissions: [] as { subject_class: string; action: string; description: string }[],
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (roleData) {
      setRole({
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions ? roleData.permissions.map(p => ({
          subject_class: p.subject_class,
          action: p.action,
          description: p.description ?? ""
        })) : [],
      });

      const initialSelected = (roleData.permissions ?? []).map(
        (p) => `${p.subject_class}:${p.action}`
      );
      setSelectedPermissions(initialSelected);
    }
  }, [roleData]);

  const handlePermissionChange = (subject: string, action: string, checked: boolean) => {
    const key = `${subject}:${action}`;
    if (checked) {
      setSelectedPermissions([...selectedPermissions, key]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
    }
  };

  const handleSave = () => {
    console.log("Saving role:", {
      ...role,
      permissions: selectedPermissions.map((perm) => {
        const [subject_class, action] = perm.split(":");
        return { subject_class, action };
      }),
    });
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
              Selecciona los permisos agrupados por entidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allPermissions.map((group) => (
                <div key={group.subject}>
                  <h3 className="font-semibold text-lg mb-2">
                    {group.subject}
                  </h3>
                  <div className="space-y-2">
                    {group.actions.map((action) => {
                      const key = `${group.subject}:${action}`;
                      const assignedPermission = role.permissions.find(
                        (p) =>
                          p.subject_class === group.subject &&
                          p.action === action
                      );
                      return (
                        <div
                          key={key}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={key}
                            checked={selectedPermissions.includes(key)}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                group.subject,
                                action,
                                checked as boolean
                              )
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={key}
                              className="text-sm font-medium leading-none"
                            >
                              {action}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {assignedPermission
                                ? assignedPermission.description
                                : `Permiso para ${action} ${group.subject}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
