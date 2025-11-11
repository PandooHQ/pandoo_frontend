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
import { useState, useMemo } from "react";

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

const USERS_PER_PAGE = 10;

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
    selectedUsers,
    setSelectedUsers,
    handleUserSelect,
    setCurrentStep,
    handleFinishRole
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Obtener usuarios de la página actual
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  // Reiniciar a la página 1 cuando cambian los filtros
  const handleFilterChange = (filterFn: (value: string) => void, value: string) => {
    filterFn(value);
    setCurrentPage(1);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Mostrar todas las páginas si son 5 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con elipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

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
              onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
              className="pl-8"
            />
          </div>
          <Select 
            value={departmentFilter} 
            onValueChange={(value) => handleFilterChange(setDepartmentFilter, value)}
          >
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
          <Select 
            value={jobTitleFilter} 
            onValueChange={(value) => handleFilterChange(setJobTitleFilter, value)}
          >
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
                      paginatedUsers.length > 0 &&
                      paginatedUsers.every((user) => 
                        selectedUsers.includes(parseInt(user.id))
                      )
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const newSelections = [
                          ...selectedUsers,
                          ...paginatedUsers
                            .map((user) => parseInt(user.id))
                            .filter((id) => !selectedUsers.includes(id))
                        ];
                        setSelectedUsers(newSelections);
                      } else {
                        const pageUserIds = paginatedUsers.map((user) => parseInt(user.id));
                        setSelectedUsers(
                          selectedUsers.filter((id) => !pageUserIds.includes(id))
                        );
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
              {paginatedUsers.map((user) => (
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
            Mostrando {((currentPage - 1) * USERS_PER_PAGE) + 1} - {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} de {filteredUsers.length} usuarios
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
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