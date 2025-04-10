
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type SearchResult = {
  id: string;
  title: string;
  type: "course" | "assignment" | "mentor" | "community";
  url: string;
};

const mockSearchResults: SearchResult[] = [
  { id: "1", title: "Angular.js from scratch", type: "course", url: "/courses" },
  { id: "2", title: "Figma from A to Z", type: "course", url: "/courses" },
  { id: "3", title: "Bitbucket Complete Guide", type: "course", url: "/courses" },
  { id: "4", title: "Angular Authentication", type: "assignment", url: "/assignments" },
  { id: "5", title: "Guy Hawkins", type: "mentor", url: "/profile" },
  { id: "6", title: "UI/UX Design Group", type: "community", url: "/community" },
];

type SearchBarProps = {
  className?: string;
};

const SearchBar = ({ className }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (value: string) => {
    setSearch(value);
    
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    
    // Filter mock results based on search term
    const filtered = mockSearchResults.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(filtered);
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "course":
        return "📚";
      case "assignment":
        return "📝";
      case "mentor":
        return "👨‍🏫";
      case "community":
        return "👥";
      default:
        return "🔍";
    }
  };

  return (
    <>
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-md pl-3 text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-96"
          onClick={() => setOpen(true)}
        >
          <span className="hidden lg:inline-flex">Search everything...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            placeholder="Search everything..." 
            className="flex h-10 w-full rounded-md px-0 border-0 focus:ring-0 focus:outline-none"
            value={search}
            onValueChange={handleSearch}
          />
          {search !== "" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Courses">
            {results
              .filter(result => result.type === "course")
              .map(result => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    setOpen(false);
                    // Navigate to URL
                  }}
                >
                  <div className="mr-2">{getTypeIcon(result.type)}</div>
                  <span>{result.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Assignments">
            {results
              .filter(result => result.type === "assignment")
              .map(result => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    setOpen(false);
                    // Navigate to URL
                  }}
                >
                  <div className="mr-2">{getTypeIcon(result.type)}</div>
                  <span>{result.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Mentors">
            {results
              .filter(result => result.type === "mentor")
              .map(result => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    setOpen(false);
                    // Navigate to URL
                  }}
                >
                  <div className="mr-2">{getTypeIcon(result.type)}</div>
                  <span>{result.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Community">
            {results
              .filter(result => result.type === "community")
              .map(result => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    setOpen(false);
                    // Navigate to URL
                  }}
                >
                  <div className="mr-2">{getTypeIcon(result.type)}</div>
                  <span>{result.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
