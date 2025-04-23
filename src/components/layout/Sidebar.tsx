
import { Home, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const routes = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
    },
    {
      label: 'Courses',
      icon: BookOpen,
      href: '/courses',
    }
  ];

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="p-3 space-y-2">
        {routes.map((route) => (
          <NavLink
            key={route.href}
            to={route.href}
            className={({ isActive }) =>
              cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
              )
            }
          >
            <div className="flex items-center flex-1">
              <route.icon className="h-5 w-5 mr-3" />
              {route.label}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
