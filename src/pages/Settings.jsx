import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { 
  ArrowDown,
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  LogOut
} from 'lucide-react';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled 
        ? "Two-factor authentication has been disabled." 
        : "Two-factor authentication has been enabled.",
    });
  };

  const handleKycUpload = () => {
    toast({
      title: "Document Uploaded",
      description: "Your KYC document has been uploaded for review.",
    });
    setKycStatus('pending');
  };

  const getKycStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-400/20 text-green-400">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-orange-400/20 text-orange-400">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-400/20 text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Submitted</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-coinstake-black text-foreground">
      <NavBar />

      <div className="p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="hidden md:inline">KYC</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-coinstake-gold rounded-full flex items-center justify-center text-coinstake-black font-bold text-2xl">
                      J
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">John Doe</h3>
                    <p className="text-muted-foreground">Member since January 2024</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="United States" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="btn-gold">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Change Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="btn-gold">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Two-Factor Authentication</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app to generate verification codes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} />
                      <span className="text-sm text-white">
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  {!twoFactorEnabled && (
                    <Button variant="outline" className="btn-outline-gold">
                      Setup 2FA
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-coinstake-gold" />
                      <div>
                        <p className="font-semibold text-white">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • New York, US</p>
                      </div>
                    </div>
                    <Badge className="bg-green-400/20 text-green-400">Active</Badge>
                  </div>
                  <Button variant="destructive" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout All Other Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-semibold text-white mb-4">Notification Types</h4>
                  <div className="space-y-3">
                    {[
                      'Staking rewards received',
                      'Withdrawal processed',
                      'New referral signup',
                      'Rank progression updates',
                      'Security alerts',
                      'System maintenance'
                    ].map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{type}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Identity Verification (KYC)</span>
                  </div>
                  {getKycStatusBadge(kycStatus)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-orange-400/10 border border-orange-400/30 rounded-lg">
                  <h4 className="font-semibold text-orange-400 mb-2">Verification Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete your identity verification to increase withdrawal limits and access premium features.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Government-issued ID</h4>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Upload a clear photo of your passport, driver's license, or national ID
                      </p>
                      <Button variant="outline" onClick={handleKycUpload}>
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Proof of Address</h4>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Upload a utility bill, bank statement, or government document (not older than 3 months)
                      </p>
                      <Button variant="outline" onClick={handleKycUpload}>
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Selfie Verification</h4>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Take a selfie holding your government-issued ID next to your face
                      </p>
                      <Button variant="outline">
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="btn-gold w-full" disabled={kycStatus === 'pending'}>
                  {kycStatus === 'pending' ? 'Documents Under Review' : 'Submit for Verification'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
