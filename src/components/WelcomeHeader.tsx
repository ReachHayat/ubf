
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFirstName = () => {
    if (!user) return "Guest";
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }
    
    if (user.email) {
      return user.email.split("@")[0];
    }
    
    return "User";
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">
        {getGreeting()}, {getFirstName()}! 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        Welcome to the Ultimate Brand Framework. Here's your learning journey today.
      </p>
    </div>
  );
}

export default WelcomeHeader;
