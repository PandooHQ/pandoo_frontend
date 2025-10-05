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
import { Badge } from "@/shared/components/ui/badge";
import { Save, Shield, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/shared/components/ui/sonner";
import { useRole } from "../hooks/useRole";
import { actionLabels, allPermissions } from "../constant/permissions";
import { useRoles } from "../hooks/useRoles";

export default function EditRolePage() {
  const { createPermissionMutation, deletePermissionMutation } = useRoles();

  const router = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const { data: roleData } = useRole(Number(id) || 0);

  const [role, setRole] = useState({
    id: 0,
    name: "",
    description: "",
    permissions: [] as {
      id: number;
      subject_class: string;
      action: string;
      description: string;
    }[],
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (roleData) {
      setRole({
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions
          ? roleData.permissions.map((p) => ({
              id: p.id, // 🔹 Importante: Incluir el ID del permiso
              subject_class: p.subject_class,
              action: p.action,
              description: p.description ?? "",
            }))
          : [],
      });

      const initialSelected = (roleData.permissions ?? []).map(
        (p) => `${p.subject_class}.${p.action}`
      );
      setSelectedPermissions(initialSelected);
    }
  }, [roleData]);

  const isPermissionSelected = (subject: string, action: string) => {
    return selectedPermissions.includes(`${subject}.${action}`);
  };

  const isSubjectFullySelected = (subject: string, actions: string[]) => {
    return actions.every((action) => isPermissionSelected(subject, action));
  };

  const getSelectedCount = (subject: string, actions: string[]) => {
    return actions.filter((action) => isPermissionSelected(subject, action))
      .length;
  };

  const handlePermissionChange = (
    subject: string,
    action: string,
    checked: boolean
  ) => {
    const key = `${subject}.${action}`;
    if (checked) {
      setSelectedPermissions([...selectedPermissions, key]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
    }
  };

  const handleSubjectToggle = (
    subject: string,
    actions: string[],
    checked: boolean
  ) => {
    actions.forEach((action) => {
      const key = `${subject}.${action}`;
      if (checked) {
        if (!selectedPermissions.includes(key)) {
          setSelectedPermissions((prev) => [...prev, key]);
        }
      } else {
        setSelectedPermissions((prev) => prev.filter((p) => p !== key));
      }
    });
  };

  const handleSave = async () => {
    try {
      const currentPermissionKeys = role.permissions.map(
        (p) => `${p.subject_class}.${p.action}`
      );

      const permissionsToCreate = selectedPermissions.filter(
        (key) => !currentPermissionKeys.includes(key)
      );

      const permissionsToDelete = role.permissions.filter(
        (p) => !selectedPermissions.includes(`${p.subject_class}.${p.action}`)
      );

      const createPromises = permissionsToCreate.map((permission) => {
        const [subject_class, action] = permission.split(".");
        return createPermissionMutation({
          roleId: role.id,
          permissionData: {
            action,
            subject_class,
            description: `Permiso para ${actionLabels[action] || action} en ${subject_class}`,
          },
        });
      });

      const deletePromises = permissionsToDelete.map((permission) => {
        const permissionId = permission.id;
        if (permissionId) {
          return deletePermissionMutation({
            roleId: role.id,
            permissionId: permissionId,
          });
        }
        return Promise.resolve();
      });

      await Promise.all([...createPromises, ...deletePromises]);

      toast.success("Los permisos del rol han sido actualizados correctamente");

      setTimeout(() => {
        router(`/${lang}/roles`);
      }, 1500);
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      toast.error("Ha ocurrido un error");
    }
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router(`/${lang}/roles`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Información básica del rol */}
        <Card className="h-fit">
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
                placeholder="Ej: Supervisor"
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
                placeholder="Describe las responsabilidades de este rol..."
              />
            </div>

            {selectedPermissions.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  Total de permisos: {selectedPermissions.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map((category) => {
                    const count = getSelectedCount(
                      category.subject,
                      category.actions
                    );
                    if (count === 0) return null;
                    return (
                      <Badge key={category.subject} variant="secondary">
                        {category.label}: {count}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuración de permisos */}
        <Card>
          <CardHeader>
            <CardTitle>Permisos del Rol</CardTitle>
            <CardDescription>
              Selecciona los permisos que tendrá este rol. Puedes seleccionar
              permisos específicos o categorías completas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allPermissions.map((category) => {
                const Icon = category.icon;
                const selectedCount = getSelectedCount(
                  category.subject,
                  category.actions
                );
                const isFullySelected = isSubjectFullySelected(
                  category.subject,
                  category.actions
                );
                const isPartiallySelected =
                  selectedCount > 0 && !isFullySelected;

                return (
                  <div
                    key={category.subject}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-0.5">
                          <Checkbox
                            id={`category-${category.subject}`}
                            checked={isFullySelected}
                            ref={(el) => {
                              if (el) {
                                const input = el.querySelector(
                                  'input[type="checkbox"]'
                                );
                                if (input)
                                  (input as HTMLInputElement).indeterminate =
                                    isPartiallySelected;
                              }
                            }}
                            onCheckedChange={(checked) =>
                              handleSubjectToggle(
                                category.subject,
                                category.actions,
                                checked as boolean
                              )
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className="h-5 w-5 text-primary" />
                            <Label
                              htmlFor={`category-${category.subject}`}
                              className="text-lg font-semibold cursor-pointer"
                            >
                              {category.label}
                            </Label>
                            {selectedCount > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                {selectedCount} / {category.actions.length}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-9">
                      {category.actions.map((action) => {
                        const key = `${category.subject}.${action}`;
                        const assignedPermission = role.permissions.find(
                          (p) =>
                            p.subject_class === category.subject &&
                            p.action === action
                        );

                        return (
                          <div
                            key={key}
                            className="flex items-center space-x-2 p-2 rounded border border-transparent hover:border-border hover:bg-muted/30 transition-colors"
                          >
                            <Checkbox
                              id={key}
                              checked={isPermissionSelected(
                                category.subject,
                                action
                              )}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  category.subject,
                                  action,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={key}
                              className="text-sm cursor-pointer flex-1"
                              title={
                                assignedPermission?.description ||
                                `Permiso para ${action} ${category.label}`
                              }
                            >
                              {actionLabels[action] || action}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button onClick={handleSave} size="lg">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </div>
  );
}
