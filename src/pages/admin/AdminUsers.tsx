
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Trash2, 
  Search, 
  UserPlus, 
  CheckCircle, 
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockUsers = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "johndoe@example.com", 
    role: "admin",
    status: "active",
    joinDate: "2023-08-15",
    lastLogin: "2024-03-10" 
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "janesmith@example.com", 
    role: "instructor",
    status: "active",
    joinDate: "2023-09-22",
    lastLogin: "2024-04-02" 
  },
  { 
    id: "3", 
    name: "Robert Johnson", 
    email: "robert@example.com", 
    role: "student",
    status: "active",
    joinDate: "2023-10-05",
    lastLogin: "2024-04-08" 
  },
  { 
    id: "4", 
    name: "Emily Wilson", 
    email: "emily@example.com", 
    role: "student",
    status: "inactive",
    joinDate: "2023-11-18",
    lastLogin: "2024-02-14" 
  },
  { 
    id: "5", 
    name: "Michael Brown", 
    email: "michael@example.com", 
    role: "instructor",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "2024-04-09" 
  },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : user.role === "instructor" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-500" />
                        <span>Inactive</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
