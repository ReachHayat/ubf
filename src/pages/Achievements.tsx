
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Trophy, Star, BookOpen, Zap, Target, Award } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "Course Completer",
    description: "Complete your first course",
    progress: 80,
    current: 4,
    total: 5,
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    unlocked: false
  },
  {
    id: 2,
    title: "Fast Learner",
    description: "Complete 5 lessons in a single day",
    progress: 60,
    current: 3,
    total: 5,
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    unlocked: false
  },
  {
    id: 3,
    title: "Perfect Score",
    description: "Get 100% on an assignment",
    progress: 100,
    current: 1,
    total: 1,
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    unlocked: true,
    unlockedDate: "Apr 28, 2023"
  },
  {
    id: 4,
    title: "Dedication",
    description: "Log in for 7 consecutive days",
    progress: 100,
    current: 7,
    total: 7,
    icon: Trophy,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    unlocked: true,
    unlockedDate: "May 2, 2023"
  },
  {
    id: 5,
    title: "Knowledge Seeker",
    description: "Complete 10 different modules",
    progress: 40,
    current: 4,
    total: 10,
    icon: Medal,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    unlocked: false
  },
  {
    id: 6,
    title: "Top Student",
    description: "Achieve an average grade of 90% or higher",
    progress: 95,
    current: 95,
    total: 100,
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    unlocked: false
  }
];

const statistics = {
  totalAchievements: achievements.length,
  unlockedAchievements: achievements.filter(a => a.unlocked).length,
  percentComplete: Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100),
  nextAchievementProgress: 80
};

const Achievements = () => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">Track your learning milestones and accomplishments</p>
      </header>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 text-primary border-4 border-primary">
              <Trophy className="w-12 h-12" />
            </div>
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
              {statistics.unlockedAchievements}
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Achievement Progress</h2>
              <p className="text-muted-foreground">
                You've unlocked {statistics.unlockedAchievements} out of {statistics.totalAchievements} achievements
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{statistics.percentComplete}% Complete</span>
                <span className="text-sm text-muted-foreground">{statistics.unlockedAchievements}/{statistics.totalAchievements}</span>
              </div>
              <Progress value={statistics.percentComplete} className="h-2" />
            </div>
            
            <div className="text-sm text-muted-foreground">
              {statistics.unlockedAchievements < statistics.totalAchievements ? (
                <span>Next achievement: <span className="font-medium text-foreground">Course Completer</span> ({statistics.nextAchievementProgress}% complete)</span>
              ) : (
                <span>Congratulations! You've unlocked all available achievements.</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Achievements In Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgressAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card key={achievement.id} className={`p-6 border ${achievement.borderColor}`}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${achievement.bgColor}`}>
                      <Icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium">{achievement.progress}% Complete</span>
                      <span className="text-xs text-muted-foreground">{achievement.current}/{achievement.total}</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Unlocked Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card key={achievement.id} className="p-6 border-2 border-green-500/20 bg-green-500/5">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-green-500/10">
                      <Icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">Unlocked on {achievement.unlockedDate}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  
                  <div className="mt-4 flex justify-center">
                    <Award className="h-8 w-8 text-amber-500" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
