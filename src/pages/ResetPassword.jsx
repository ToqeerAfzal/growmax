import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userServices } from "../../Services/userServices";

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [token, setToken] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [tokenError, setTokenError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if(!email || email.length === 0) {
      navigate("/forgot-password")
      toast({
        title: "Email is required",
        description: "Pleas enter your email and resend OTP.",
      });
    }
  })

  useEffect(() => {
    setPageLoading(false);
  }, []);

  const validateToken = (input) => {
    const errors = []
    if(input.length !== 6) {
      errors.push("OTP must be exactly 6 digits");
    }
    if (errors.length > 0) {
      setTokenError(errors);
    } else {
      setTokenError([]);
    }
  }

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
      setPasswordError(errors);
    } else {
      setPasswordError([]);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      let userData = {};
      userData.token = token;
      userData.email = email;
      userData.newPassword = newPassword;
      userData.repeatPassword = repeatPassword;

      let data = await userServices.resetPassword(userData);
      console.log(data)
      if (data.statusCode === 200) {
        toast({
          title: "Pasword reset Successful",
          description: "You can now login to your panel.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Pasword reset failed",
          description: data?.customMessage || "Invalid OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading user portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-section min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Right Side - Login Form */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/logo.png"
                alt="GrowmaxGlobal"
                className="h-[100px]"
              />
            </div>
          </div>
        </div>
        <Card className="feature-card w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4">
              <div className="text-center">
                <div className="flex justify-center">
                  <img
                    src="/lovable-uploads/logo.png"
                    alt="GrowmaxGlobal"
                    className="h-[100px]"
                  />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Reset Password
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-muted-foreground">OTP</label>
                    <Input
                      type="text"
                      onChange={(e) => { setToken(e.target.value); validateToken(e.target.value) }}
                      value={token}
                      placeholder="Enter OTP"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-muted-foreground">New Password</label>
                    <Input
                      type="password"
                      onChange={(e) => { setNewPassword(e.target.value); validatePassword(e.target.value) }}
                      value={newPassword}
                      placeholder="Enter new password"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-muted-foreground">Confirm Password</label>
                    <Input
                      type="password"
                      onChange={ (e) => { setRepeatPassword(e.target.value)}}
                      value={repeatPassword}
                      placeholder="Confirm new password"
                      className="text-sm"
                    />
                  </div>
                </div>
                {passwordError?.map((data, index) => (
                  <div key={index} style={{ fontSize: 11, marginTop: 5 }}>- {data}</div>
                )) }
                {tokenError?.map((data, index) => (
                  <div key={index} style={{ fontSize: 11, marginTop: 5 }}>- {data}</div>
                ))}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold shadow-lg hover:shadow-orange-400/25 transition-all duration-200"
                disabled={ !token || !newPassword || !repeatPassword || passwordError?.length > 0 ||
                  tokenError.length > 0 }
                >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Reseting..." : "Reset Now"}
              </Button>
            </form>
            <Link
              to="/"
              className="fixed top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
