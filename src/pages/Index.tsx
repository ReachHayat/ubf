
import { useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LazyLineChart = React.lazy(() => import("../components/dashboard/DashboardChart"));

const data = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading completion
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Good Morning!</h1>
          <p className="text-secondary-foreground">Welcome back to your financial overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <DollarSign className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Total Balance", "Monthly Income", "Monthly Expenses"].map((title, i) => (
          <Card key={i} className="p-6 shadow-sm hover:shadow-md transition-shadow">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <h2 className="text-2xl font-bold">
                    {i === 0 ? "$24,563.00" : i === 1 ? "$8,350.00" : "$3,628.00"}
                  </h2>
                </div>
                <div className={`p-2 ${i === 2 ? "bg-red-100" : i === 1 ? "bg-blue-100" : "bg-green-100"} rounded-full`}>
                  {i === 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : i === 1 ? (
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Spending Overview</h3>
          <div className="h-[300px] w-full">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <LazyLineChart data={data} />
            </Suspense>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-full">
                      <PieChart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Shopping</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <p className="font-medium text-red-500">-$150.00</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
