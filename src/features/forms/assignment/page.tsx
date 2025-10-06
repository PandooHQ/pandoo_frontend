import { useState } from "react";
import { useMyForms } from "../hooks/useMyForm";
import { useUsers } from "@/shared/hooks/useUsers";
import { useDepartments } from "@/shared/hooks/useDepartments";
import { usePositions } from "@/shared/hooks/usePositions";
import type { User } from "@/shared/types/UsersContextType";
import { toast, Toaster } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignments } from "@/shared/hooks/useAssignments";
import AssignmentMetrics from "../components/assignment/AssignmentMetrics";
import AssignmentForms from "../components/assignment/AssignmentForms";
import AssignmentUsers from "../components/assignment/AssignmentUsers";

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
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const usersPerPage = 10;

  const filteredUsers = users.filter((user: User) => {
    if (positionFilter !== "all" && user?.position?.name !== positionFilter)
      return false;
    if (
      departmentFilter !== "all" &&
      String(user?.department_id) !== String(departmentFilter)
    )
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
          <h1 className="text-2xl font-bold tracking-tight">
            Asignacion de formulario
          </h1>
          <p className="text-muted-foreground">
            Asignar formularios a multiples usuarios eficientemente
          </p>
        </div>
      </div>

      <AssignmentMetrics
        totalForms={forms?.length || 0}
        totalUsers={users?.length || 0}
      />

      <AssignmentForms
        forms={forms}
        selectedFormForAssignment={selectedFormForAssignment}
        setSelectedFormForAssignment={setSelectedFormForAssignment}
      />

      <AssignmentUsers
        users={users}
        departments={departments}
        positions={positions}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
        positionFilter={positionFilter}
        isAllSelected={isAllSelected}
        selectedUsers={selectedUsers}
        filteredUsers={filteredUsers}
        setPositionFilter={setPositionFilter}
        handleSelectAll={handleSelectAll}
        setSelectedUsers={setSelectedUsers}
        setCurrentPage={setCurrentPage}
        handleSave={handleSave}
        selectedFormForAssignment={selectedFormForAssignment}
        batchLoading={batchLoading}
        totalPages={totalPages}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
      />

      <Toaster richColors />
    </div>
  );
}
