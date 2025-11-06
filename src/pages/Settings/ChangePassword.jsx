
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LockKeyhole, Save } from 'lucide-react';
import { userServices } from '../../../Services/userServices';
import { useState } from 'react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState([]);

  const changePassword = async () => {
    let userData = {}
    userData.currentPassword = currentPassword
    userData.newPassword = newPassword
    userData.repeatPassword = repeatPassword
    let data = await userServices.changePassword(userData)
    if (data?.statusCode === 200) {
      setNewPassword("")
      setRepeatPassword("")
      setCurrentPassword("")
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
      setError(errors);
    } else {
      setError([]);
    }
  };
  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg sm:text-xl">
          <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-coinstake-gold" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm text-muted-foreground">Current Password</label>
          <Input
            type="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            value={currentPassword}
            placeholder="Enter current password"
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">New Password</label>
            <Input
              type="password"
              onChange={(e) => {setNewPassword(e.target.value); validatePassword(e.target.value)}}
              value={newPassword}
              placeholder="Enter new password"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">Confirm Password</label>
            <Input
              type="password"
              onChange={(e) => setRepeatPassword(e.target.value)}
              value={repeatPassword}
              placeholder="Confirm new password"
              className="text-sm"
            />
          </div>
        </div>
        {error?.map((data, index) => (
          <div style={{ fontSize: 11, marginTop: 5 }}>{index + 1}. {data}</div>
        ))}
        <Button
          onClick={changePassword}
          disabled={!currentPassword || !newPassword || !repeatPassword || error?.length > 0}
          className="btn-gold w-full sm:w-auto">
          <LockKeyhole className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
