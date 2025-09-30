import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@constructoraln.com",
    phone: "+56 9 8765 4321",
    position: "Equipment Operator",
    department: "Operations",
    status: "active",
    location: "Santiago, Chile",
    sendNotifications: true,
    canCreateForms: false,
    isAdmin: false,
  });

  const user = {
    id: 1,
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    phone: formData.phone,
    position: formData.position,
    department: formData.department,
    status: formData.status,
    joinDate: "2024-03-15",
    location: formData.location,
    avatar: "/placeholder-user.png",
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: "Carlos",
      lastName: "Mendoza",
      email: "carlos.mendoza@constructoraln.com",
      phone: "+56 9 8765 4321",
      position: "Equipment Operator",
      department: "Operations",
      status: "active",
      location: "Santiago, Chile",
      sendNotifications: true,
      canCreateForms: false,
      isAdmin: false,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 bg-white"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-base text-muted-foreground">
                  {user.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.department}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Usuario
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>
              Datos personales y de contacto del usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">
                      {user.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ubicación</p>
                    <p className="text-sm text-muted-foreground">
                      {user.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha de Ingreso</p>
                    <p className="text-sm text-muted-foreground">
                      {user.joinDate}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Información Laboral" : "Información Laboral"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Configuración del cargo del usuario"
                : "Detalles del puesto de trabajo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operaciones</SelectItem>
                      <SelectItem value="Quality Control">
                        Control de Calidad
                      </SelectItem>
                      <SelectItem value="Safety">Seguridad</SelectItem>
                      <SelectItem value="Maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="Administration">
                        Administración
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Cargo Actual</h4>
                  <p className="text-muted-foreground">{user.position}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Departamento</h4>
                  <p className="text-muted-foreground">{user.department}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
