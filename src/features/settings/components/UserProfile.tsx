import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mail, Phone, Calendar } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import type { FormDataType, UserDataType } from "../types/FormDataType";
import type { Department } from "@/shared/types/DepartmentsContextType";
import type { Position } from "@/shared/types/PositionsContextType";

interface Props {
    formData: FormDataType;
    setFormData: Dispatch<SetStateAction<FormDataType>>; 
    departments: Department[];
    positions: Position[];
    isEditing: boolean;
    user: UserDataType
}

const UserProfile = ({formData, setFormData, departments, positions, isEditing, user}: Props) => {

  return (
    <div className="grid gap-6 md:grid-cols-2">
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
                    setFormData({
                      ...formData,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.last_name!}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      last_name: e.target.value,
                    })
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
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
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
                <Select
                  value={formData.position_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      position_id: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-[220px]">
                    {positions.find((p) => p.id === formData.position_id)
                      ?.name || "Seleccione"}
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id.toString()}>
                        {pos.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      department_id: Number(value),
                    })
                  }
                >
                  <SelectTrigger className="w-[220px]">
                    {departments.find((d) => d.id === formData.department_id)
                      ?.name || "Seleccione"}
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : ( 
            <>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Cargo Actual</h4>
                <p className="text-muted-foreground">
                  {positions.find((p) => p.id === formData.position_id)?.name ||
                    user.position}
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Departamento</h4>
                <p className="text-muted-foreground">
                  {departments.find((d) => d.id === formData.department_id)
                    ?.name || user.department}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
