
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MentorCard from "./MentorCard";

const topMentors = [
  {
    id: 1,
    name: "Guy Hawkins",
    areas: ["Frontend Development", "Backend Development"],
    courses: 145,
    followers: 1287,
    rating: 4.5,
    path: "/profile/mentor/1"
  },
  {
    id: 2,
    name: "Crystal Lucas",
    areas: ["UI / UX Design"],
    courses: 55,
    followers: 423,
    rating: 4.8,
    path: "/profile/mentor/2"
  },
  {
    id: 3,
    name: "Melissa Stevens",
    areas: ["Interaction Design", "Web Design", "Backend Development"],
    courses: 25,
    followers: 521,
    rating: 5.0,
    path: "/profile/mentor/3"
  },
  {
    id: 4,
    name: "Peter Russell",
    areas: ["Android Development", "Version Control"],
    courses: 215,
    followers: 112,
    rating: 4.0,
    path: "/profile/mentor/4"
  }
];

const TopMentors = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Top Mentors</h2>
        <Link to="/community">
          <Button variant="ghost" className="text-primary" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {topMentors.map((mentor) => (
          <MentorCard key={mentor.id} {...mentor} />
        ))}
      </div>
    </div>
  );
};

export default TopMentors;
