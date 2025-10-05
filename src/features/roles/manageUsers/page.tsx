import { useState, useEffect, useContext } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Save, Search, UserCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/shared/api/getUsers";
import { baseUrl } from "@/shared/api/api";
import { toast, Toaster } from "sonner";
import { UsersContext } from "@/shared/hooks/UsersContext";
import { useDepartments } from "@/shared/hooks/useDepartments";
import { usePositions } from "@/shared/hooks/usePositions";

export default function ManageUsersPage() {
  const { departments } = useDepartments();
  const { positions } = usePositions();

  const { id: roleId, lang } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const router = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [selectedJobTitle, setSelectedJobTitle] = useState("Todos");
  type ApiUser = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role_id: number;
    role?: { name?: string };
    position?: { name?: string };
    department?: { name?: string };
    profile_picture?: string;
    hasAdminRole?: boolean;
    name?: string;
  };

  const [users, setUsers] = useState<ApiUser[]>([]);

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const { updateUser } = useContext(UsersContext);

  useEffect(() => {
    if (apiResponse?.data) {
      const mappedUsers = apiResponse.data.map((user: ApiUser) => ({
        ...user,
        hasAdminRole: user.role_id === parseInt(roleId ?? "0"),
        name: `${user.first_name} ${user.last_name}`,
        position: user.position || "Sin cargo",
        department: user.department || "Sin departamento",
      }));
      setUsers(mappedUsers);
    }
  }, [apiResponse, roleId]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "Todos" ||
      user.department?.name === selectedDepartment;

    const matchesJobTitle =
      selectedJobTitle === "Todos" || user.position?.name === selectedJobTitle;

    return matchesSearch && matchesDepartment && matchesJobTitle;
  });

  const handleUserRoleChange = (userId: number, hasRole: boolean) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, hasAdminRole: hasRole } : user
      )
    );
  };

  const adminUsersCount = users.filter((user) => user.hasAdminRole).length;

  const handleSave = async () => {
    try {
      const usersWithAdminRole = users.filter((user) => user.hasAdminRole);
      await Promise.all(
        usersWithAdminRole.map((user) =>
          updateUser({ id: user.id.toString(), role_id: Number(roleId) })
        )
      );

      toast.success(`Roles de los usuarios actualizados`);

      setTimeout(() => {
        router(`/${lang}/roles`);
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestionar Usuarios - {name}
          </h1>
          <p className="text-muted-foreground">
            Asignar y remover el rol de Administrator a usuarios
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Usuarios con Rol {name}
          </CardTitle>
          <CardDescription>
            {adminUsersCount} usuario{adminUsersCount !== 1 ? "s" : ""} con rol
            de {name}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignación de Usuarios</CardTitle>
          <CardDescription>
            Selecciona los usuarios que tendrán el rol de {name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuarios por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los Departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedJobTitle}
              onValueChange={setSelectedJobTitle}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los Cargos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {positions?.map((pos) => (
                  <SelectItem key={pos.id} value={pos.name}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((user) => user.hasAdminRole)
                      }
                      onCheckedChange={(checked) => {
                        const userIds = filteredUsers.map((user) => user.id);
                        setUsers(
                          users.map((user) =>
                            userIds.includes(user.id)
                              ? { ...user, hasAdminRole: !!checked }
                              : user
                          )
                        );
                      }}
                    />
                  </TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Rol Actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={user.hasAdminRole}
                          onCheckedChange={(checked) =>
                            handleUserRoleChange(user.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                `${baseUrl.split("/api")[0]}` +
                                user.profile_picture
                              }
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                            <AvatarFallback>
                              {getInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user?.position?.name}</TableCell>
                      <TableCell>{user?.department?.name}</TableCell>
                      <TableCell>{user?.role?.name || "Sin rol"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster richColors />
    </div>
  );
}
