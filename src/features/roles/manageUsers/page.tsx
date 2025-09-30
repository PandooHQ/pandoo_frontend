import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Save, Search, UserCheck, ArrowLeft, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@constructoraln.com",
    position: "Operador de Equipos",
    department: "Operaciones",
    currentRole: "Usuario Simple",
    hasAdminRole: false,
    status: "active",
  },
  {
    id: 2,
    name: "María González",
    email: "maria.gonzalez@constructoraln.com",
    position: "Inspector de Calidad",
    department: "Control de Calidad",
    currentRole: "Inspector de Calidad",
    hasAdminRole: false,
    status: "active",
  },
  {
    id: 3,
    name: "Roberto Silva",
    email: "roberto.silva@constructoraln.com",
    position: "Supervisor de Seguridad",
    department: "Seguridad",
    currentRole: "Supervisor de Seguridad",
    hasAdminRole: true,
    status: "active",
  },
  {
    id: 4,
    name: "Ana Torres",
    email: "ana.torres@constructoraln.com",
    position: "Coordinadora de Sitio",
    department: "Operaciones",
    currentRole: "Coordinador de Sitio",
    hasAdminRole: false,
    status: "active",
  },
  {
    id: 5,
    name: "Luis Ramírez",
    email: "luis.ramirez@constructoraln.com",
    position: "Gerente de Proyecto",
    department: "Gestión",
    currentRole: "Gerente de Proyecto",
    hasAdminRole: true,
    status: "active",
  },
]

const departments = ["Todos", "Operaciones", "Control de Calidad", "Seguridad", "Gestión", "Mantenimiento"]
const jobTitles = [
  "Todos",
  "Operador de Equipos",
  "Inspector de Calidad",
  "Supervisor de Seguridad",
  "Coordinadora de Sitio",
  "Gerente de Proyecto",
]

export default function ManageUsersPage() {
  const router = useNavigate()
//   const params = useParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("Todos")
  const [selectedJobTitle, setSelectedJobTitle] = useState("Todos")
  const [users, setUsers] = useState(mockUsers)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "Todos" || user.department === selectedDepartment
    const matchesJobTitle = selectedJobTitle === "Todos" || user.position === selectedJobTitle
    return matchesSearch && matchesDepartment && matchesJobTitle
  })

  const handleUserRoleChange = (userId: number, hasRole: boolean) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, hasAdminRole: hasRole } : user)))
  }

  const adminUsersCount = users.filter((user) => user.hasAdminRole).length

  const handleSave = () => {
    const usersWithAdminRole = users.filter((user) => user.hasAdminRole)
    console.log("Saving users with Administrator role:", usersWithAdminRole)
    router("/roles")
  }

  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestionar Usuarios - Administrator</h1>
              <p className="text-muted-foreground">Asignar y remover el rol de Administrator a usuarios</p>
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
                Usuarios con Rol Administrator
              </CardTitle>
              <CardDescription>
                {adminUsersCount} usuario{adminUsersCount !== 1 ? "s" : ""} con rol de Administrator
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asignación de Usuarios</CardTitle>
              <CardDescription>Selecciona los usuarios que tendrán el rol de Administrator</CardDescription>
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
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos los Departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos los Cargos" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
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
                          checked={filteredUsers.length > 0 && filteredUsers.every((user) => user.hasAdminRole)}
                          onCheckedChange={(checked) => {
                            const userIds = filteredUsers.map((user) => user.id)
                            setUsers(
                              users.map((user) =>
                                userIds.includes(user.id) ? { ...user, hasAdminRole: checked as boolean } : user,
                              ),
                            )
                          }}
                        />
                      </TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Rol Actual</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={user.hasAdminRole}
                            onCheckedChange={(checked) => handleUserRoleChange(user.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.position}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.currentRole}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
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
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
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
        </div>
  )
}
