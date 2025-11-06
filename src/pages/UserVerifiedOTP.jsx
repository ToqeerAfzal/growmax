import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userServices } from "../../Services/userServices";

const UserVerifiedOTP = () => {
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const otpInputs = useRef([]);
  const [loading, setLoading] = useState(false);
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

  const verifyTwoFAForAppLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userData = {};
      userData.OTP = otpValues;
      let data = await userServices.verifyTwoFAForAppLogin(userData);
      if (data.statusCode === 200) {
        localStorage.setItem("twoFA", JSON.stringify(false));
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        navigate("/dashboard");
        window.location.reload();
      } else {
        toast({
          title: "Login Failed",
          description: data?.customMessage || "Invalid credentials or role.",
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
          <p className="text-white">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      });
    }
    return stars;
  };

  const stars = generateStars();

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtpValues(newOtp);

      // Optionally, focus the last field after pasting
      otpInputs.current[5]?.focus();
    }
  };

  const logoutUser = async () => {
    let data = await userServices.logout();
    if (data.statusCode === 200) {
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: "2s",
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-500/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-orange-500/15 to-yellow-400/10 rounded-full blur-2xl z-[-1]"></div>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Right Side - Login Form */}
       <Card className="card-glow w-full max-w-md mx-auto px-4 sm:px-6 mt-10">
        <CardHeader className="text-center">
          <div className="text-center lg:flex justify-center">
            <img
              src="/lovable-uploads/logo.png"
              alt="GrowmaxGlobal"
              className="h-[120px] w-[160px] mx-auto"
            />
          </div>
            <CardTitle className="text-2xl font-bold text-white">
              2FA OTP
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={verifyTwoFAForAppLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2 justify-center w-full py-6">
                  {otpValues.map((value, index) => (
                    <Input
                      key={index}
                      type="text"
                      pattern="\d*"
                      maxLength="1"
                      className={`border text-center otp__digit otp__field__${index + 1
                        }`}
                      style={{ height: 35, width: 35 }}
                      value={value}
                      onChange={(e) => handleInputChange(index, e)}
                      onPaste={(e) => handlePaste(e)}
                      ref={(input) => (otpInputs.current[index] = input)}
                    />
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-semibold shadow-lg hover:shadow-orange-400/25 transition-all duration-200"
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Verifying..." : "Verify Now"}
              </Button>
            </form>
            <div className="text-center mt-3">
              <Button
                className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                onClick={() => {
                  logoutUser();
                }}
              >
                Logout
              </Button>
            </div>
            <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
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
          </CardContent>
        </Card>

        {/* Back to Home */}
        {/* <Link
        to="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link> */}
      </div>
    </div>
  );
};

export default UserVerifiedOTP;
