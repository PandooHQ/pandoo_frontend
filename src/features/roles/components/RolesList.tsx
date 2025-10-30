import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Role } from "../types/RolesType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RolesContext } from "../hooks/RolesContext";
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

interface Props {
  roles: Role[] | undefined;
}

export const RolesList = ({ roles }: Props) => {
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { deleteRole } = useContext(RolesContext);

  const router = useNavigate();

  const openDeleteModal = (role: Role) => {
    if (role.name === "admin") return;
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id);
      toast.success("Se elimino el rol correctamente");
    } catch (error) {
      console.error("Error eliminando rol:", error);
      toast.error("Error al eliminar el rol");
    } finally {
      setRoleToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditRole = (roleId: number) => {
    router(`edit/${roleId}`);
  };

  const handleManageUsers = (role: Role) => {
    router(`manage-users/${role.id}?name=${encodeURIComponent(role.name)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Roles</CardTitle>
        <CardDescription>
          Ver y gestionar todos los roles del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Rol</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role: Role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="font-medium">{role.name}</div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {role.description}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {role.name !== "admin" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleEditRole(role.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteModal(role)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleManageUsers(role)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Gestionar Usuarios
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Toaster richColors />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Rol"
        description={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </Card>
  );
};
