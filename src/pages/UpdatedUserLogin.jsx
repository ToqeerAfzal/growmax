
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { userServices } from '../../Services/userServices';

const UpdatedUserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();

  const validatePassword = (input) => {
    const errors = [];
    if (input.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[a-z]/.test(input)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(input)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/\d/.test(input)) {
      errors.push("Password must contain at least one digit.");
    }
    if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(input)) {
      errors.push("Password must contain at least one special character.");
    }

    if (errors.length > 0) {
      setError(errors);
    } else {
      setError([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      let data = await userServices.login(email, password, ['user'])

      if (data.statusCode === 200) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-0">
          <div className='flex justify-center'>
            <img
              src="/lovable-uploads/logo.png"
              alt="GrowmaxGlobal"
              className="h-[100px]"
            />
          </div>
          {/* <p className="text-gray-400 text-lg">Stake, Earn, Grow</p> */}
        </div>

        <Card className="feature-card w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your GrowmaxGlobal account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter any email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
                />
              </div>

              <div className="space-y-2 pb-3">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter any password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value) }}
                    disabled={loading}
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-orange-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {error?.map((data, index) => (
                <div style={{ fontSize: 11, marginTop: 5 }} className='text-red-500'>{index + 1}. {data}</div>
              ))}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold shadow-lg hover:shadow-orange-400/25 transition-all duration-200"
                disabled={loading || !email || !password || error?.length > 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <div className="space-y-4 pt-4">
              <div className="text-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#111111] px-2 text-gray-400">Don't have an account?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/signup"
                  className="inline-block w-full text-center px-4 py-2 border border-orange-400 text-orange-400 hover:bg-orange-400/10 rounded-md transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {year} GrowmaxGlobal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UpdatedUserLogin;
