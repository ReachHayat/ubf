
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signUp(signupEmail, signupPassword, signupFullName);
    setIsSubmitting(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">1Focus</h1>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{isLogin ? "Sign in to your account" : "Create an account"}</h2>
            <p className="text-gray-500 mt-1">
              {isLogin 
                ? "Enter your details to access your account" 
                : "Let's get started with your 30 days free trial"}
            </p>
          </div>
        </div>

        {isLogin ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-teal-800 hover:bg-teal-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button 
                  type="button" 
                  onClick={() => setIsLogin(false)}
                  variant="link"
                  className="p-0"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input 
                id="fullName" 
                placeholder="e.g. Yasir Noori" 
                required
                value={signupFullName}
                onChange={(e) => setSignupFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupEmail">Email</Label>
              <Input 
                id="signupEmail" 
                type="email" 
                placeholder="you@example.com" 
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupPassword">Password</Label>
              <Input 
                id="signupPassword" 
                type="password" 
                placeholder="••••••••"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-teal-800 hover:bg-teal-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button 
                  type="button" 
                  onClick={() => setIsLogin(true)}
                  variant="link"
                  className="p-0"
                >
                  Sign in
                </Button>
              </p>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Help@Aura.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
