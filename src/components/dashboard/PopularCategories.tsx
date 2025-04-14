
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";

interface PopularCategoriesProps {
  categories: string[];
}

const categoryIcons: Record<string, { icon: string; color: string }> = {
  "Design": { icon: "🎨", color: "bg-purple-400" },
  "Marketing": { icon: "📊", color: "bg-blue-400" },
  "Development": { icon: "💻", color: "bg-emerald-400" },
  "Business": { icon: "💼", color: "bg-amber-400" },
  "Frontend Development": { icon: "🖥️", color: "bg-cyan-400" },
  "Backend Development": { icon: "⚙️", color: "bg-green-400" },
  "UI/UX Design": { icon: "🎯", color: "bg-violet-400" },
  "Communication": { icon: "🗣️", color: "bg-pink-400" },
  "DevOps": { icon: "🔄", color: "bg-indigo-400" },
  "Data Science": { icon: "📈", color: "bg-red-400" },
  "Default": { icon: "📚", color: "bg-gray-400" }
};

const PopularCategories = ({ categories = [] }: PopularCategoriesProps) => {
  // Generate count data based on categories
  const categoriesWithCount = categories.map((category) => {
    // Get icon and color from our mapping, or use default
    const { icon, color } = categoryIcons[category] || categoryIcons["Default"];
    
    // Generate a random count for demonstration
    const count = Math.floor(Math.random() * 20) + 5;
    
    return {
      name: category,
      count,
      icon,
      color
    };
  });

  // Sort categories by (random) count for the demo
  const sortedCategories = [...categoriesWithCount].sort((a, b) => b.count - a.count);
  
  // Only display up to 4 categories
  const displayCategories = sortedCategories.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popular Categories</h2>
        <Button variant="ghost" asChild>
          <Link to="/courses">Browse All</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {displayCategories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            count={category.count}
            icon={category.icon}
            color={category.color}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
