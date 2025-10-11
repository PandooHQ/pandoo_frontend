import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { ApiUser } from "../../types/ApiUser";
import type { Dispatch, SetStateAction } from "react";
import { baseUrl } from "@/shared/api/api";

interface Props {
    filteredUsers : ApiUser[],
    setUsers: Dispatch<SetStateAction<ApiUser[]>>,
    users: ApiUser[],
    handleUserRoleChange: (userId: number, hasRole: boolean) => void,
    getInitials: (firstName: string, lastName: string) => string
}

const TableUsers = ({filteredUsers, users, setUsers, handleUserRoleChange, getInitials }: Props) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  filteredUsers.length > 0 &&
                  filteredUsers.every((user) => user.hasAdminRole)
                }
                onCheckedChange={(checked) => {
                  const userIds = filteredUsers.map((user) => user.id);
                  setUsers(
                    users.map((user) =>
                      userIds.includes(user.id)
                        ? { ...user, hasAdminRole: !!checked }
                        : user
                    )
                  );
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
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={user.hasAdminRole}
                    onCheckedChange={(checked) =>
                      handleUserRoleChange(user.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          `${baseUrl.split("/api")[0]}` + user.profile_picture
                        }
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback>
                        {getInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user?.position?.name}</TableCell>
                <TableCell>{user?.department?.name}</TableCell>
                <TableCell>{user?.role?.name || "Sin rol"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableUsers;
