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
import type { Department } from "@/shared/types/DepartmentsContextType";
import type { Position } from "@/shared/types/PositionsContextType";
import type { User } from "@/shared/types/UsersContextType";
import { CheckCircle, Loader2, Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  users: User[];
  departments: Department[];
  positions: Position[];
  currentPage: number;
  usersPerPage: number;
  positionFilter: string;
  isAllSelected: boolean;
  selectedUsers: string[];
  filteredUsers: User[];
  setPositionFilter: Dispatch<SetStateAction<string>>;
  handleSelectAll: (checked: boolean) => void;
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  handleSave: () => Promise<void>;
  selectedFormForAssignment: string;
  batchLoading: boolean;
  totalPages: number;
  departmentFilter: string;
  setDepartmentFilter: Dispatch<SetStateAction<string>>;
}

const AssignmentUsers = ({
  users,
  departments,
  positions,
  currentPage,
  usersPerPage,
  positionFilter,
  isAllSelected,
  selectedUsers,
  filteredUsers,
  setPositionFilter,
  handleSelectAll,
  setSelectedUsers,
  setCurrentPage,
  handleSave,
  selectedFormForAssignment,
  batchLoading,
  totalPages,
  departmentFilter,
  setDepartmentFilter,
}: Props) => {
  return (
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
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departments.map((dept) => (
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
                          <span className="font-medium">{user.first_name}</span>
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
                Mostrando {(currentPage - 1) * usersPerPage + 1} to{" "}
                {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
              {selectedUsers.length} usuario
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
  );
};

export default AssignmentUsers;
