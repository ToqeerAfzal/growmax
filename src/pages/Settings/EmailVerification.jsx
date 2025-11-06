import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { userServices } from "../../../Services/userServices"
import { useToast } from "@/hooks/use-toast"

const EmailVerification = () => {
  const [loader, setLoader] = useState(false)
  const [resendEmailLoader, setResendEmailLoader] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""))
  const otpInputs = useRef([])

  async function getUserDetails() {
    const userDetails = await userServices.getCurrentUserDetails()
    setCurrentUser(userDetails)
  }
  useEffect(() => {
    getUserDetails()
  }, [])

  const resendVerificationEmail = async () => {
    setResendEmailLoader(true)
    const userData = { email: currentUser.email }
    const data = await userServices.sendEmailVerificationMail(userData)
    setResendEmailLoader(false)
    setOtpValues(["", "", "", "", "", ""]);
  }

  const verifyUserEmail = async () => {
    setLoader(true);
    const userData = { email: currentUser.email, otp: otpValues };
    const data = await userServices.verifyUserEmail(userData);
    setLoader(false);
    if(data?.statusCode === 200) {
      console.log(data)
      localStorage.setItem("emailVerifiedAt", JSON.stringify(data.emailVerifiedAt));
      setOtpValues(["", "", "", "", "", ""]);
      window.location.reload();
    }
  }

  const handleInputChange = (index, e) => {
    const value = e.target.value
    if(value === "" || /^[0-9]$/.test(value)) {
      const updatedValues = [...otpValues]
      updatedValues[index] = value
      setOtpValues(updatedValues)

      if(value !== "" && index < 5) {
        otpInputs.current[index + 1].focus()
      }

      if(value === "" && index > 0) {
        otpInputs.current[index - 1].focus()
      }
    }
  }

  return (
    <>
      { currentUser &&
        <>
          <center>
            <Label className="mb-0 fw-bold">Enter the Email Verification OTP</Label>
          </center>
          <div className="flex gap-2 justify-center w-full py-6">
            { otpValues.map((value, index) => (
              <Input
                key={ index }
                type="text"
                pattern="\d*"
                maxLength="1"
                className={ `border text-center otp__digit otp__field__${index + 1
                  }` }
                style={ { height: 35, width: 35 } }
                value={ value }
                onChange={ (e) => handleInputChange(index, e) }
                onPaste={ (e) => handlePaste(e) }
                ref={ (input) => (otpInputs.current[index] = input) }
              />
            )) }
          </div>
          <div className="flex gap-3 justify-center w-full">
            <Button
              className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
              onClick={ () => verifyUserEmail() }
            >
              { loader ? "Verifying..." : "Verify" }
            </Button>

            <Button
              className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
              onClick={ () => resendVerificationEmail() }
            >
              { resendEmailLoader ? "Sending..." : "Resend" }
            </Button>
          </div>
        </>
      }
    </>
  )
}

export default EmailVerification
