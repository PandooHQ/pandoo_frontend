import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Users,
  UserCheck,
  Mail,
  Phone,
  FileText,
  Activity,
} from "lucide-react";
import { UsersContext } from "@/shared/hooks/UsersContext";
import { RolesContext } from "../roles/hooks/RolesContext";
import { PositionCombobox } from "./components/PositionCombobox";
import { usePositions } from "@/shared/hooks/usePositions";
import { useDepartments } from "@/shared/hooks/useDepartments";
import { toast, Toaster } from "sonner";
import { DepartmentCombobox } from "./components/DepartmentCombobox";

export default function PersonnelManagementPage() {
  const { users } = useContext(UsersContext);
  const { roles } = useContext(RolesContext);

  const { departments, createDepartment } = useDepartments();
  const { positions, createPositions } = usePositions();
  const { createUser } = useContext(UsersContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  type Personnel = {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    avatar: string | File;
  };

  const [mockPersonnel, setMockPersonnel] = useState<Personnel[]>([]);


  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [position, setPosition] = useState<{ id: number; name: string } | null>(null)
  const [department, setDepartment] = useState<{ id: number; name: string } | null>(null)


  useEffect(() => {
    const transformedPersonnel = users.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone || "N/A",
      position: user.position?.name || "N/A",
      department: user.department?.name || "N/A",
      avatar: user.profile_picture
        ? user.profile_picture
        : "/placeholder-user.png",
    }));
    setMockPersonnel(transformedPersonnel);
  }, [users]);

  const filteredPersonnel = mockPersonnel.filter((person) => {
    const matchesSearch =
      person?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      person?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      person?.position?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || person.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleViewProfile = (userId: number) => {
    console.log("Ver perfil de usuario con ID:", userId);
    toast.info("Confirma manuel si hay q hacer esto xd, Redirigiendo al perfil...");
  };

  const handleCreateUser = async () => {
    try {
      const payload = {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          position_id: position?.id || 0,
          department_id: department?.id || 0,
          password: password
      };

      await createUser(payload);

      toast.success("Usuario creado exitosamente");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear usuario");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Personal
          </h1>
          <p className="text-muted-foreground">
            Administra cuentas de usuario, roles y permisos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Personal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Personal</DialogTitle>
                <DialogDescription>
                  Crea una nueva cuenta de usuario e ingresa su informacion
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ingresa el nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ingresa el apellido"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@constructoraln.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 0000 0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <PositionCombobox
                      positions={positions ?? []}
                      onSelect={(pos) =>
                        setPosition(pos)
                      }
                      createPositions={createPositions}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <DepartmentCombobox
                    departments={departments ?? []}
                    onSelect={(dept) =>
                      setDepartment(dept)
                    }
                    createDepartments={createDepartment}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser}>
                  Crear Cuenta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Personal
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPersonnel?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPersonnel?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              En todos los usuarios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio Actividad
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              +5% de la semana pasada
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Departamentos</SelectItem>
              {departments &&
                departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPersonnel?.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    typeof person.avatar === "string"
                      ? person.avatar
                      : person.avatar instanceof File
                      ? URL.createObjectURL(person.avatar)
                      : "/placeholder.svg"
                  }
                  alt={person.name}
                />
                <AvatarFallback>
                  {person.name
                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{person.name}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{person.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{person.phone}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>
                    {person.position} • {person.department}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleViewProfile(Number(person.id))}
                  >
                    Ver Perfil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <Toaster richColors />
    </div>
  );
}
