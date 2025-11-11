import { useContext, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/shared/components/ui/sonner";
import { Shield, Users, CheckCircle } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UsersContext } from "@/shared/hooks/UsersContext";
import { UserAssignment } from "../components/configure/UserAssignment";
import { RolesContext } from "../hooks/RolesContext";
import PermissionsConfiguration from "../components/configure/PermissionsConfiguration";

export default function ConfigureRolePage() {
  const router = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const roleName = decodeURIComponent(params.name as string);
  const { lang } = params;
  const roleDescription = searchParams.get("description") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [jobTitleFilter, setJobTitleFilter] = useState("all");

  const { users, updateUser } = useContext(UsersContext);
  const { createPermissionMutation } = useContext(RolesContext);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || user?.department?.name === departmentFilter;
    const matchesJobTitle =
      jobTitleFilter === "all" || user?.position?.name === jobTitleFilter;
    return matchesSearch && matchesDepartment && matchesJobTitle;
  });

  console.log(filteredUsers)

  const departments = [...new Set(users.map((user) => user?.department?.name))];
  const jobTitles = [...new Set(users.map((user) => user?.position?.name))];

  const handlePermissionSelect = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, permissionId]);
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => id !== permissionId)
      );
    }
  };

  const handleUserSelect = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleFinishRole = async () => {
    if (!roleName || selectedPermissions.length === 0) return;

    try {
      await Promise.all(
        selectedPermissions.map((permission) => {
          const [subject_class, action] = permission.split(".");
          return createPermissionMutation({
            roleId: Number(roleName),
            permissionData: {
              action,
              subject_class,
              description: `Permiso para ${action} en ${subject_class}`,
            },
          });
        })
      );

      await Promise.all(
        selectedUsers.map((id) =>
          updateUser({ id: id.toString(), role_id: Number(roleName) })
        )
      );

      toast.success(`Rol "${roleDescription}" configurado con permisos`);

      setTimeout(() => {
        router(`/${lang}/roles`);
      }, 1500);
    } catch (error) {
      console.error("Error configurando permisos:", error);
      toast.error("Error al configurar los permisos del rol");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configurar Rol: {roleName}
          </h1>
          <p className="text-muted-foreground">{roleDescription}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Paso {currentStep} de 2</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div
          className={`flex items-center space-x-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
          </div>
          <span className="font-medium">Configurar Permisos</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div
          className={`flex items-center space-x-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <Users className="h-4 w-4" />
          </div>
          <span className="font-medium">Asignar Usuarios</span>
        </div>
      </div>

      {currentStep === 1 && (
        <PermissionsConfiguration
          handlePermissionSelect={handlePermissionSelect}
          selectedPermissions={selectedPermissions}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 2 && (
        <UserAssignment
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          jobTitleFilter={jobTitleFilter}
          setJobTitleFilter={setJobTitleFilter}
          filteredUsers={filteredUsers}
          users={users}
          selectedUsers={selectedUsers}
          handleUserSelect={handleUserSelect}
          setCurrentStep={setCurrentStep}
          handleFinishRole={handleFinishRole}
          departments={departments}
          jobTitles={jobTitles}
          setSelectedUsers={setSelectedUsers}
        />
      )}
      <Toaster richColors />
    </div>
  );
}
