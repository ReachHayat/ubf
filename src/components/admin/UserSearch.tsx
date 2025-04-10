
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
}

const UserSearch = ({ searchTerm, onSearchChange, onAddUser }: UserSearchProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onAddUser}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add New User
      </Button>
    </div>
  );
};

export default UserSearch;
