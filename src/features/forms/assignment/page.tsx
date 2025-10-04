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
import { Search, FileText, Users, CheckCircle, Activity, Loader2 } from "lucide-react";
import { useMyForms } from "../hooks/useMyForm";
import { useUsers } from "@/shared/hooks/useUsers";
import { useDepartments } from "@/shared/hooks/useDepartments";
import { usePositions } from "@/shared/hooks/usePositions";
import type { User } from "@/shared/types/UsersContextType";
import { toast, Toaster } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignments } from "@/shared/hooks/useAssignments";

export default function BulkFormAssignmentPage() {
  const { forms } = useMyForms();
  const { users } = useUsers();
  const { departments } = useDepartments();
  const { positions } = usePositions();
  const { createAssignment } = useAssignments();
  const router = useNavigate();
  const { lang } = useParams();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [selectedFormForAssignment, setSelectedFormForAssignment] =
    useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [positionFilter, setPositionFilter] = useState("all");
  const usersPerPage = 10;

  const filteredUsers = users.filter((user: User) => {
    if (positionFilter !== "all" && user?.position?.name !== positionFilter)
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user: User) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const isAllSelected =
    users.length > 0 && selectedUsers.length === users.length;

  const handleSave = async () => {
    setBatchLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((user) =>
          createAssignment({
            user_id: parseInt(user),
            id: parseInt(selectedFormForAssignment),
          })
        )
      );
      toast.success("Asignacion realizada con exito");
      setTimeout(() => {
          router(`/${lang}/forms`);
      }, 2000);
    } catch (err) {
      console.error("Error creando asignaciones:", err);
      toast.error("Ha ocurrido un error durante la asignacion");
    } finally {
        setTimeout(() => {
            setBatchLoading(false);
        }, 2000);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Asignacion de formulario
          </h1>
          <p className="text-muted-foreground">
            Asignar formularios a multiples usuarios eficientemente
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Assignment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Form Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Paso 1: Selecciona un formulario para asignar</CardTitle>
          <CardDescription>
            Elige el formulario que quieras asignar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Busca formularios..." className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {forms &&
                forms?.map((form) => (
                  <Card
                    key={form.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 text-wrap  ${
                      selectedFormForAssignment === form.id.toString()
                        ? "border-primary bg-muted shadow-md"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() =>
                      setSelectedFormForAssignment(form.id.toString())
                    }
                  >
                    <CardHeader className="pb-2 px-3 pt-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight break-words whitespace-normal">
                            {form.title}
                          </h4>
                        </div>
                        {selectedFormForAssignment === form.id.toString() && (
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 ml-1" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-3 pt-0">
                      <p className="text-xs text-muted-foreground break-words whitespace-normal">
                        {form.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">
                Mostrando {forms.length} de {forms.length} formularios
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pagina 1 de 1
                </span>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Paso 2: Selecciona usuarios</CardTitle>
          <CardDescription>
            Elige los usuarios para asignar el formulario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Buscar usuarios..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments &&
                    departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los cargos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cargos</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.name}>
                      {position.name}
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
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Cargo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers &&
                    filteredUsers.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(
                                  selectedUsers.filter((id) => id !== user.id)
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.first_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.department?.name || "No asignado"}
                        </TableCell>
                        <TableCell>
                          {user.position?.name || "No asignado"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {!users && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)}{" "}
                  of {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedUsers.length} usuarios
                {selectedUsers.length !== 1 ? "s" : ""} seleccionados
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedUsers([])}>
                  Limpiar seleccion
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={
                    !selectedFormForAssignment || 
                    selectedUsers.length === 0 || 
                    batchLoading
                  }
                >
                  {batchLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Asignando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Asignar formulario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster richColors />
    </div>
  );
}
