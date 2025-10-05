import { useContext, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Plus, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { RolesList } from "./components/RolesList";
import { RolesMetrics } from "./components/RolesMetrics";
import { RolesContext } from "./hooks/RolesContext";
import { toast } from "sonner";

export default function RolesPage() {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const router = useNavigate();

  const { roles, createRole } = useContext(RolesContext);
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) return;

    try {
      const createdRole = await createRole({
        name: newRole.name,
        description: newRole.description,
      });

      const roleId = createdRole.id;

      if (roleId) {
        toast.success("Rol creado exitosamente");

        setTimeout(() => {
          router(
            `/${lang}/roles/configure/${roleId}?name=${encodeURIComponent(createdRole.name)}&description=${encodeURIComponent(createdRole.description)}`
          );
        }, 1500);
      }

      setNewRole({ name: "", description: "" });
      setIsCreateRoleOpen(false);
    } catch (error) {
      console.error("Error creando rol:", error);
      toast.error("Ha ocurrido un error");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Resumen de Roles
          </h1>
          <p className="text-muted-foreground">
            Gestionar roles de usuario y permisos de acceso
          </p>
        </div>
        <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Rol
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Rol</DialogTitle>
              <DialogDescription>
                Define el nombre y descripción del rol. Configurarás los
                permisos en el siguiente paso.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nombre del Rol</Label>
                <Input
                  id="role-name"
                  placeholder="ej., Supervisor de Campo"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Descripción</Label>
                <Textarea
                  id="role-description"
                  placeholder="Describe las responsabilidades del rol..."
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateRoleOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateRole}
                  disabled={!newRole.name || !newRole.description}
                >
                  Siguiente: Configurar Permisos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <RolesMetrics roles={roles} />
      <RolesList roles={roles} />
    </div>
  );
}
