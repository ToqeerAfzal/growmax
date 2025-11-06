
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, UserRoundCog } from 'lucide-react';
import { userServices } from '../../../Services/userServices';
import { useEffect, useState } from 'react';

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const getCurrectLoginUser = async () => {
    let data = await userServices.getCurrectLoginUser()
    setEmail(data?.email)
    setFirstName(data?.firstName)
    setMiddleName(data?.middleName)
    setLastName(data?.lastName)
    setUserName(data?.userName)
    setPhone(data?.phone)
  }

  const updateProfile = async () => {
    let userData = {}
    userData.firstName = firstName
    userData.middleName = middleName
    userData.lastName = lastName
    userData.phone = phone
    userData.userName = userName
    let data = await userServices.updateProfile(userData)
    if (data?.statusCode === 200) {
      getCurrectLoginUser()
    }
  }

  useEffect(() => {
    getCurrectLoginUser();
  }, []);
  return (
    < Card className="card-glow" >
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg sm:text-xl">
          <UserRoundCog className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-coinstake-gold" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">User Email</label>
            <Input
              disabled
              value={email}
              className={"bg-muted text-sm"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">User Name</label>
            <Input
              disabled
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "");
                setUserName(value);
              }}
              value={userName}
              className={"bg-muted text-sm"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">First Name</label>
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="Enter First Name"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">Middle Name</label>
            <Input
              onChange={(e) => setMiddleName(e.target.value)}
              value={middleName}
              placeholder="Enter Middle Name"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">Last Name</label>
            <Input
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder="Enter Last Name"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground">Phone</label>
            <Input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              placeholder="Enter Phone Number"
              className="text-sm"
            />
          </div>
        </div>
        <Button
          onClick={updateProfile}
          className="btn-gold w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardContent>
    </Card >
  );
};

export default UpdateProfile;
