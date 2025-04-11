
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
    <div className="flex h-screen bg-gray-100">
      <div className="flex w-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-2">
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
              
              <div className="mt-8 mb-6">
                <h2 className="text-2xl font-bold">Create an account</h2>
                <p className="text-gray-500 mt-1">Let's get started with your 30 days free trial</p>
              </div>

              <div className="inline-block px-4 py-2 bg-white rounded-full text-sm text-gray-600 mb-8">
                Free for personal use
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
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

                <Button 
                  type="button" 
                  onClick={() => setIsLogin(false)}
                  className="w-full bg-lime-200 text-black hover:bg-lime-300"
                >
                  Create Account
                </Button>
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
                
                <Button 
                  type="button" 
                  onClick={() => setIsLogin(true)}
                  className="w-full bg-lime-200 text-black hover:bg-lime-300"
                >
                  Sign in
                </Button>
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
        
        {/* Right side - Image and content */}
        <div className="hidden md:flex w-1/2 bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/e98cd24b-ef7d-485c-b055-e522a1b42a50.png" 
              alt="Woman working on laptop" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white bg-gradient-to-t from-black/50 to-transparent">
            <h2 className="text-4xl font-bold mb-2">The simplest way</h2>
            <h3 className="text-4xl font-bold">to manage your workforce</h3>
          </div>
          
          {/* Navigation dots */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
          </div>
          
          {/* Navigation arrows */}
          <div className="absolute bottom-10 left-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/20 border-none text-white hover:bg-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Button>
          </div>
          <div className="absolute bottom-10 right-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/20 border-none text-white hover:bg-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
