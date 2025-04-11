
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "./CategoryCard";

const popularCategories = [
  {
    id: 1,
    name: "Docker",
    courses: 220,
    hours: "123:24h",
    logo: "D",
    bgColor: "bg-blue-400",
    path: "/courses?category=docker"
  },
  {
    id: 2,
    name: "GitLab",
    courses: 220,
    hours: "123:24h",
    logo: "G",
    bgColor: "bg-orange-500",
    path: "/courses?category=gitlab"
  },
  {
    id: 3,
    name: "C#",
    courses: 220,
    hours: "123:24h",
    logo: "C",
    bgColor: "bg-purple-500",
    path: "/courses?category=csharp"
  },
  {
    id: 4,
    name: "Webflow",
    courses: 220,
    hours: "123:24h",
    logo: "W",
    bgColor: "bg-blue-600",
    path: "/courses?category=webflow"
  }
];

const PopularCategories = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Popular Categories</h2>
        <Link to="/courses">
          <Button variant="ghost" className="text-primary" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {popularCategories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
