
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Users, Shield, Coins, ArrowLeft } from 'lucide-react';
import { userServices } from '../../Services/userServices';

const UserSignup = () => {
  const currentUrl = window.location.href;
  const splitUrl = currentUrl?.split("/");
  const currentPath = splitUrl[4];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [errors, setErrors] = useState({ userName: "" });
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: currentPath || "",
    agreeTerms: false
  });
  const navigate = useNavigate();

  const handleUserNameChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));

    if (name === "userName") {
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        setErrors((e) => ({
          ...e,
          userName: "Only letters (a–z, A–Z) and numbers (0–9) allowed",
        }));
      } else {
        setErrors((e) => ({ ...e, userName: "" }));
      }
    }

  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result = await userServices.userRegistration(formData)
    setLoading(false);
    if (result.statusCode === 200) {
      navigate('/login');
      window.location.reload();
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <div className='flex justify-center'>
              <img
                src="/lovable-uploads/logo.png"
                alt="GrowmaxGlobal"
                className="h-[100px]"
              />
            </div>
            <p className="text-xl text-gray-400">Start your crypto staking journey today</p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: Coins,
                title: 'High Yields',
                description: 'Earn up to 24% APY on your crypto investments'
              },
              {
                icon: Users,
                title: 'Referral Rewards',
                description: '18-level deep referral system with unlimited earning potential'
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Bank-grade security with smart contract audits'
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="feature-card w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <p className="text-gray-400">Join thousands of smart investors</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">UserName <span className="text-red-500">*</span></Label>
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleUserNameChange}
                  className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                  placeholder="Enter UserName"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">{errors.userName}</p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className='text-red-500'>*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className='text-red-500'>*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className='text-red-500'>*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => { handleInputChange(e); validatePassword(e.target.value) }}
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error?.map((data, index) => (
                <div style={{ fontSize: 11, marginTop: 5 }} className='text-red-500'>{index + 1}. {data}</div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className='text-red-500'>*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword !== formData.password &&
                  <div style={{ fontSize: 11, marginTop: 5 }} className='text-red-500'>* Password not match.</div>
                }
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code <span className='text-red-500'>*</span></Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="bg-black/20 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20"
                  placeholder="Enter referral code"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked }))}
                />
                <Label className="text-sm">
                  I agree to the <span className="text-primary cursor-pointer hover:underline" title='Terms and conditions'><a href='https://growmaxglobal.io/terms' target='__blank'> T&C</a></span> and <span className="text-primary cursor-pointer hover:underline"><a href='https://growmaxglobal.io/privacy' target='__blank'> Privacy Policy</a></span>
                </Label>
              </div>
              <Button
                type="submit"
                className="btn-gold w-full text-lg py-6"
                disabled={loading || !formData?.userName || !formData?.firstName || !formData?.email || !formData?.password || !formData?.confirmPassword || !formData?.phone || !formData?.referralCode || !formData.agreeTerms || error?.length > 0}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#111111] text-gray-400">Security Features</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Shield className="h-6 w-6 text-primary mx-auto" />
                  <p className="text-xs text-gray-400">Secure Login</p>
                </div>
                <div className="space-y-1">
                  <Users className="h-6 w-6 text-primary mx-auto" />
                  <p className="text-xs text-gray-400">KYC Verified</p>
                </div>
                <div className="space-y-1">
                  <Coins className="h-6 w-6 text-primary mx-auto" />
                  <p className="text-xs text-gray-400">Insured Funds</p>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors hidden sm:flex"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default UserSignup;
