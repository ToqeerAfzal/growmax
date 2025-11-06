
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Save,
  ArrowDown,
  Eye,
  EyeOff,
  Wallet
} from 'lucide-react';

const UpdatedSettings = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: 'john_doe_crypto',
    email: 'john.doe@email.com',
    mobile: '+1234567890',
    walletAddress: '0x742d35Cc6634C0532925a3b8D',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Basic validation
    if (!formData.username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // Clear password fields after successful change
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    toast({
      title: "Success",
      description: "Password changed successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-coinstake-black text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-coinstake-gold hover:text-coinstake-gold-dark">
            <ArrowDown className="h-5 w-5 rotate-90" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Information */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <User className="h-5 w-5 text-coinstake-gold" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed on your public profile
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-white flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Mobile Number</span>
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-white flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet Address</span>
                </Label>
                <Input
                  id="wallet"
                  value={formData.walletAddress}
                  onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                  placeholder="Enter wallet address"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveProfile} className="btn-gold">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Key className="h-5 w-5 text-coinstake-gold" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleChangePassword} variant="outline" className="btn-outline-gold">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={formData.twoFactorAuth}
                  onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your account via email</p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
              </div>
              <Switch
                checked={formData.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Referral Information */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white">Referral Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Your Referral Code</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    value="CX42A7" 
                    readOnly 
                    className="bg-muted text-center font-mono text-lg"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText('CX42A7');
                      toast({
                        title: "Copied!",
                        description: "Referral code copied to clipboard",
                      });
                    }}
                    variant="outline"
                    className="btn-outline-gold"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Share this 6-character alphanumeric code with friends to earn referral rewards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdatedSettings;
