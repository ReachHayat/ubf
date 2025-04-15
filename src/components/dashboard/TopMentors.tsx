
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MentorCard from "./MentorCard";

interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface TopMentorsProps {
  mentors: Mentor[];
}

const TopMentors = ({ mentors = [] }: TopMentorsProps) => {
  // Only show up to 4 mentors
  const displayMentors = mentors.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Top Mentors</h2>
        <Button variant="ghost" asChild>
          <Link to="/courses">View All</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {displayMentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            id={mentor.id}
            name={mentor.name}
            role={mentor.role}
            avatar={mentor.avatar}
          />
        ))}
      </div>
    </section>
  );
};

export default TopMentors;
