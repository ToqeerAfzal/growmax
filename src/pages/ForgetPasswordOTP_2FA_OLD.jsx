import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userServices } from "../../Services/userServices";

const ForgetPasswordOTP = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setPageLoading(false);
  }, []);

  const handleInputChange = (index, e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]$/.test(value)) {
      const updatedValues = [...otpValues];
      updatedValues[index] = value;
      setOtpValues(updatedValues);

      if (value !== "" && index < 5) {
        otpInputs.current[index + 1].focus();
      }

      if (value === "" && index > 0) {
        otpInputs.current[index - 1].focus();
      }
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userData = {};
      userData.OTP = otpValues;
      userData.email = email;
      let data = await userServices.forgotPassword(userData);
      if (data.message.statusCode === 200) {
        toast({
          title: "Verification Successful",
          description: "Now Reset Your password",
        });
        navigate(`/reset-password/${data?.token}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("verification error:", error);
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
                Forget Password
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={forgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex gap-2 justify-center w-full py-6">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        type="text"
                        pattern="\d*"
                        maxLength="1"
                        className={`border text-center otp__digit otp__field__${
                          index + 1
                        }`}
                        style={{ height: 35, width: 35 }}
                        value={value}
                        onChange={(e) => handleInputChange(index, e)}
                        ref={(input) => (otpInputs.current[index] = input)}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold shadow-lg hover:shadow-orange-400/25 transition-all duration-200"
                  disabled={loading || !email}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? "Verifying..." : "Verify Now"}
                </Button>
              </form>

              <div className="my-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Notice</p>
                    <p className="text-xs text-primary/80 mt-1">
                      Enter Two factor Authentication OTP for Verify
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Remember Password?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </CardContent>
          </Card>
      </div>
      {/* Back to Home */}
      {/* <Link
        to="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors hidden sm:flex"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Login</span>
      </Link> */}
    </div>
  );
};

export default ForgetPasswordOTP;
