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

import { useAuthStore } from "@/shared/stores/auth";
import { updateUser } from "@/shared/api/updateUser";

export default function SettingsPage() {
  const { user: userData, updateUser: updateState } = useAuthStore();
  // const { departments } = useDepartments();
  // const { positions } = usePositions()

  console.log(userData)

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState(
    userData || {
      id: 0,
      first_name: "John",
      last_name: "Doe",
      email: "",
      phone: "",
      position: "",
      department: "",
      location: "",
      status: "Active",
      profile_picture: "/placeholder.svg",
      created_at: "",
    }
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
      setFormData({ ...formData, profile_picture: URL.createObjectURL(e.target.files[0]) });
    }

  };

  const user = {
    id: formData?.id,
    name: `${formData?.first_name} ${formData?.last_name}`,
    email: formData?.email,
    phone: formData?.phone || "+56 9 8765 4321",
    position: formData?.position,
    department: formData?.department,
    status: formData?.status,
    joinDate: formData?.created_at,
    location: formData?.location,
    avatar: formData?.profile_picture,
  };

  const handleSave = async() => {
    const resp = await updateUser(formData.id, {
      id: formData.id.toString(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || userData?.phone,
      position_id: formData.position,
      department_id: formData.department,
      location: formData.location,
      profile_picture: profilePicture || undefined,
    });

    updateState(resp.data)
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData!);
    setIsEditing(false);
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
                    src={
                      formData.profile_picture instanceof File
                        ? URL.createObjectURL(formData.profile_picture)
                        : formData.profile_picture || "/placeholder.svg"
                    }
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
                  <>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 -right-2 bg-white"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </>
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
                    value={formData.first_name!}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name!}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
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
                    value={formData.phone || ""}
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
                {/* <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) =>
                      setFormData({ ...formData, position: value })
                    }
                  >
                    <SelectTrigger className="w-[220px]">
                      {user.position}
                    </SelectTrigger>
                    <SelectContent>
                      {
                        positions && positions.map((pos) =>(
                          <SelectItem key={pos.id} value={pos.id} >
                            {pos.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger className="w-[220px]">
                      {user.department}
                    </SelectTrigger>
                    <SelectContent>
                      {
                        departments && departments.map((dept) =>(
                          <SelectItem key={dept.id} value={dept.id} >
                            {dept.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div> */}
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
