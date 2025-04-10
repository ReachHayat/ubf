
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUsers, updateUserRole, User } from "@/services/userService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserRow from "@/components/admin/UserRow";
import UserEditDialog from "@/components/admin/UserEditDialog";
import UserDeleteDialog from "@/components/admin/UserDeleteDialog";
import UserSearch from "@/components/admin/UserSearch";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveUserRole = async (userId: string, role: "admin" | "tutor" | "student") => {
    const success = await updateUserRole(userId, role);
    
    if (success) {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, roles: [role] }
          : user
      ));

      toast({
        title: "User updated",
        description: `Role has been updated to ${role}.`,
      });

      setIsEditDialogOpen(false);
    }
  };

  const confirmDeleteUser = async () => {
    toast({
      title: "User deletion",
      description: "User deletion requires admin API access. This is just a demonstration.",
      variant: "destructive",
    });
    
    setIsDeleteDialogOpen(false);
  };

  const handleAddUser = () => {
    toast({
      title: "Adding users",
      description: "Adding new users should be done through the signup process. This button is just a placeholder."
    });
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <UserSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddUser={handleAddUser}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserRow 
                    key={user.id}
                    user={user}
                    currentUserId={currentUser?.id}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <UserEditDialog
          user={selectedUser}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveUserRole}
        />

        <UserDeleteDialog
          user={selectedUser}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
