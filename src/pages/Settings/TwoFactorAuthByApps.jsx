import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Lock, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { userServices } from "../../../Services/userServices";
import { useToast } from "@/hooks/use-toast";

const TwoFactorAuthByApps = () => {
  const { toast } = useToast();
  const [loader, setLoader] = useState(false);
  const [appTwoFA, setAppTwoFA] = useState(false);
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const otpInputs = useRef([]);

  const getTwoFactorAuthType = async () => {
    let data = await userServices.getTwoFactorAuthType();
    setAppTwoFA(data?.appTwoFA);
  };

  useEffect(() => {
    getTwoFactorAuthType();
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

  const [base64, setBase64] = useState("");
  const [secret, setSecret] = useState("");
  const [check, setCheck] = useState(false);
  const [disable, setDisable] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = async () => {
    setLoader(true);
    const data = await userServices.generateQRCode();
    setLoader(false);
    setBase64(data.base64);
    setSecret(data.secret);
  };

  const showQRCode = async () => {
    const data = await userServices.showQRCode();
    setBase64(data.base64);
    setSecret(data.secret);
    if (data) {
      setShowQR(true);
    }
  };

  const enableTwoFactorAuth = async () => {
    setLoader(true);
    const userData = { secret, OTP: otpValues };
    const data = await userServices.enableTwoFactorAuth(userData);
    setLoader(false);
    if (data?.statusCode === 200) {
      localStorage.setItem("enable2FA", JSON.stringify(true));
      window.location.reload();
      getTwoFactorAuthType();
      setOtpValues(["", "", "", "", "", ""]);
    }
  };

  const disableTwoFactorAuth = async () => {
    setLoader(true);
    const userData = { secret, OTP: otpValues };
    const data = await userServices.disableTwoFactorAuth(userData);
    setLoader(false);
    if (data?.statusCode === 200) {
      window.location.reload();
      localStorage.setItem("enable2FA", JSON.stringify(false));
      getTwoFactorAuthType();
      setDisable(false);
      setShowQR(false);
      setCheck(false);
      setOtpValues(["", "", "", "", "", ""]);
      setBase64("");
      setSecret("");
    }
  };

  const getQRDataForDisable = async () => {
    const data = await userServices.getQRData();
    setSecret(data);
    setDisable(true);
  };

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

  const copySecretCode = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast({
        title: "Copied!",
        description: "Secret code copied to clipboard",
      });
    }
  };

  return (
    <>
      {!disable ? (
        <>
          {!appTwoFA ? (
            <>
              {!check ? (
                <>
                  {base64 ? (
                    <div className="mb-3 flex justify-center">
                      <div className="border p-8 rounded-md shadow">
                        <img src={base64} alt="QR Code" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center mb-3 pt-0">
                      <div className="mb-3 flex justify-center">
                        <div className="border p-5 rounded-md border-red-400 shadow">
                          <Lock className="w-full h-36 text-red-400" />
                          <p className="m-0 block text-red-400">
                            <b>Disabled</b>
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, textAlign: "center" }}>
                        To enable Apps 2FA, generate QR. After generating the
                        QR, you have to scan the QR with the Authenticator app,
                        after that the OTP will be automatically sent to your
                        device.
                      </p>
                    </div>
                  )}

                  {base64 ? (
                    <>
                    <div className="flex gap-3 justify-center w-full">
                      <Button
                        className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                        onClick={() => setBase64("")}
                      >
                        Back
                      </Button>
                      <Button
                        className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                        onClick={() => generateQRCode()}
                      >
                        {loader
                          ? "Generating..."
                          : base64
                            ? "Re-Generate QR"
                            : "Generate QR"}
                      </Button>
                      <Button
                        className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                        onClick={() => {
                          setCheck(true);
                        }}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="mt-2 flex gap-3 items-center justify-center w-full text-sm ">
                    Secret: {secret}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copySecretCode}
                      className="text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-center" style={{fontSize: 10}}>Important: Once you enable Two-Factor Authentication (2FA), a secret code will be generated. This secret code is required for logging in and for recovering your account if you forget your password.
                    🔒 Please make sure to copy and securely save this secret code. If you lose this code and do not have backup access,</p>
                    </>
                  ) : (
                    <div className="flex gap-3 justify-center w-full">
                      <Button
                        className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                        style={{ width: 140 }}
                        onClick={() => generateQRCode()}
                      >
                        {loader
                          ? "Generating..."
                          : base64
                            ? "Re-Generate QR"
                            : "Generate QR"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <center>
                    <Label className="fw-bold mb-0">Enter OTP</Label>
                  </center>
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
                  <div className="flex gap-3 justify-center w-full">
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => {
                        setCheck(false);
                        setOtpValues(["", "", "", "", "", ""]);
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => enableTwoFactorAuth()}
                    >
                      {loader ? "Enabling..." : "Enable"}
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {!showQR ? (
                <>
                  <div className="text-center mb-4 pt-0">
                    <div className="mb-3 flex justify-center">
                      <div className="border border-green-400 text-center p-5 rounded-md shadow">
                        <Shield className="w-full mb-3 h-36 text-green-400" />
                        <p className="m-0 block text-green-400">
                          <b>Enabled (2FA by Apps)</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center w-full">
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => showQRCode()}
                    >
                      Show QR
                    </Button>
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => getQRDataForDisable()}
                    >
                      Disable
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3 flex justify-center">
                    <div className="border p-8 rounded-md shadow">
                      {base64 && <img src={base64} alt="QR Code" />}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center w-full">
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => setShowQR(false)}
                    >
                      Hide QR
                    </Button>
                    <Button
                      className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
                      onClick={() => getQRDataForDisable()}
                    >
                      Disable
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-3 items-center justify-center w-full text-sm ">
                    Secret: {secret}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copySecretCode}
                      className="text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-center" style={{fontSize: 10}}>Important: Once you enable Two-Factor Authentication (2FA), a secret code will be generated. This secret code is required for logging in and for recovering your account if you forget your password.
                    🔒 Please make sure to copy and securely save this secret code. If you lose this code and do not have backup access,</p>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <center>
            <Label className="mb-0 fw-bold">Enter OTP</Label>
          </center>
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
          <div className="flex gap-3 justify-center w-full">
            <Button
              className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
              onClick={() => {
                setDisable(false);
                setOtpValues(["", "", "", "", "", ""]);
              }}
            >
              Back
            </Button>
            <Button
              className="border border-gold-400/30 bg-gold-400/20 text-gold-400"
              onClick={() => disableTwoFactorAuth()}
            >
              {loader ? "Disabling..." : "Disable"}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default TwoFactorAuthByApps;
