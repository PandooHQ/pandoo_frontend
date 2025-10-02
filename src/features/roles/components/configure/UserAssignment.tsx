import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import type { User } from "@/shared/types/UsersContextType";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

interface Props {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    departmentFilter: string;
    setDepartmentFilter: (dept: string) => void;
    jobTitleFilter: string;
    setJobTitleFilter: (title: string) => void;
    departments: string[];
    jobTitles: string[];
    filteredUsers: User[];
    users: User[];
    selectedUsers: number[];
    setSelectedUsers: (userIds: number[]) => void;
    handleUserSelect: (userId: number, isSelected: boolean) => void;
    setCurrentStep: (step: number) => void;
    handleFinishRole: () => void;
}

export const UserAssignment = ({
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    jobTitleFilter,
    setJobTitleFilter,
    departments,
    jobTitles,
    filteredUsers,
    users,
    selectedUsers,
    setSelectedUsers,
    handleUserSelect,
    setCurrentStep,
    handleFinishRole
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignar Usuarios</CardTitle>
        <CardDescription>
          Selecciona usuarios para asignar a este rol. Cada usuario solo puede
          tener un rol.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los Departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Departamentos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los Cargos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Cargos</SelectItem>
              {jobTitles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(filteredUsers.map((user) => parseInt(user.id)));
                      } else {
                        setSelectedUsers([]);
                      }
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(parseInt(user.id))}
                      onCheckedChange={(checked) =>
                        handleUserSelect(parseInt(user.id), checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.first_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.position?.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.department?.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.role?.name}</span>
                  </TableCell>
                </TableRow>
              ))}
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

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Permisos
          </Button>
          <Button onClick={handleFinishRole}>
            Crear Rol y Asignar Usuarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
