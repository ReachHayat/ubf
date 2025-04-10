
import { User } from "@/services/userService";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface UserRowProps {
  user: User;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserRow = ({ user, currentUserId, onEdit, onDelete }: UserRowProps) => {
  const getRoleBadgeVariant = (role: string) => {
    if (role === "admin") return "default";
    if (role === "tutor") return "secondary";
    return "outline";
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.map((role, i) => (
            <Badge key={i} variant={getRoleBadgeVariant(role)}>
              {role}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          <span>Active</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(user)}
            disabled={user.id === currentUserId}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
