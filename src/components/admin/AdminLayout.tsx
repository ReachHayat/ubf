
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface AdminLayoutProps {
  title: string;
  description: string;
  activeTab: string;
  children: ReactNode;
}

const AdminLayout = ({ title, description, activeTab, children }: AdminLayoutProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Administration</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab}
            className="w-full"
          >
            {children}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLayout;
