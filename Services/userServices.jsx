import config from "../config/config.json";
import CryptoJS from 'crypto-js';
import { headers } from "../APIHelpers/Headers";
import {
  handleResponse,
  headersWithAuth,
  headersWithAuthWithoutBody,
} from "../APIHelpers/Responses";

export const userServices = {
  login,
  getTotalUserData,
  getUnderUserData,
  getUserData,
  getCurrectLoginUser,
  updateProfile,
  userRegistration,
  logout,
  getCurrentUserDetails,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserPermission,
  getStudyUserPermission,
  getAllUserLoginHistory,
  getUserFailedLoginData,
  generateQRCode,
  getQRData,
  checkQRCode,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  showQRCode,
  twoFactorAuthType,
  getTwoFactorAuthType,
  emailOTPFor2FA,
  enableTwoFactorAuthByEmail,
  disableTwoFactorAuthByEmail,
  verifyTwoFAForEmailLogin,
  verifyTwoFAForAppLogin,
  disableTwoFactorAuthByAdmin,
  sendEmailVerificationMail,
  verifyUserEmail
};

function decryptResponse(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, config.SECRETKEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

async function login(email, password, roles, fcmToken) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, roles, fcmToken }),
  };

  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}login`,
    requestOptions
  );

  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  let firstName = data?.userData?.firstName;
  let lastName = data?.userData?.lastName;
  let role = data?.userData?.roleType;
  let twoFA = data?.userData?.twoFA;
  let referralCode = data?.userData?.referralCode;
  let enable2FA = data?.userData?.enable2FA || false;
  let emailVerifiedAt = data?.userData?.emailVerifiedAt;
  if (data.statusCode === 200) {
    localStorage.setItem("token", JSON.stringify(data.token));
    localStorage.setItem("twoFA", JSON.stringify(twoFA));
    localStorage.setItem("referralCode", JSON.stringify(!!referralCode));
    localStorage.setItem("enable2FA", JSON.stringify(enable2FA));
    localStorage.setItem("emailVerifiedAt", JSON.stringify(emailVerifiedAt));
    localStorage.setItem("role", JSON.stringify(role));
    localStorage.setItem(
      "firstName",
      JSON.stringify(firstName != null ? firstName : "No")
    );
    localStorage.setItem(
      "lastName",
      JSON.stringify(lastName != null ? lastName : "")
    );
  }
  handleResponse(data);
  return data;
}

async function logout(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}logout`,
    headersWithAuth("POST", userData, headers)
  );
  localStorage.clear();
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data
}

async function getCurrentUserDetails() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getCurrectLoginUser`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserPermission(userId) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserPermission/${userId}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getTotalUserData() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getTotalUserData`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUnderUserData(userId) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUnderUser/${userId}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserData() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserData`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getCurrectLoginUser() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getCurrectLoginUser`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getStudyUserPermission(studyId, projectId) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getStudyUserPermission/${studyId}/${projectId}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function changePassword(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}changePassword`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function updateProfile(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}updateProfile`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function userRegistration(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}userRegistration`,
    headersWithAuth("POST", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function resetPassword(userData, history) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}resetPassword`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data
  // if (data.statusCode) {
  //   window.location.href = "/login";
  // }
}

async function forgotPassword(userData, history) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}forgotPassword`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  if(data?.statusCode === 400){
    handleResponse(data);
  }
  return data
}

async function getAllUserLoginHistory(userId, type) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getAllUserLoginHistory/${userId}/${type}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserFailedLoginData(userId) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserFailedLoginData/${userId}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

// Generate QR code
async function generateQRCode() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}generateQRCode`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

// Get QR Data
async function getQRData() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getQRData`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

// Show QR code
async function showQRCode() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}showQRCode`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

// Check QR & OTP
async function checkQRCode(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}checkQRCode`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Enable Two Factor Auth
async function enableTwoFactorAuth(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}enableTwoFactorAuth`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Disable Two Factor Auth
async function disableTwoFactorAuth(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}disableTwoFactorAuth`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Get Auth Type
async function getTwoFactorAuthType() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getTwoFactorAuthType`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

// Update Auth Type
async function twoFactorAuthType(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}twoFactorAuthType`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Send OTP for Email two factor auth
async function emailOTPFor2FA(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}emailOTPFor2FA`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Disable Email Two Factor Auth
async function disableTwoFactorAuthByEmail(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}disableTwoFactorAuthByEmail`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Enable Email Two Factor Auth
async function enableTwoFactorAuthByEmail(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}enableTwoFactorAuthByEmail`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Verify Two FA for Email Login
async function verifyTwoFAForEmailLogin(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}verifyTwoFAForEmailLogin`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Verify Two FA for App Login
async function verifyTwoFAForAppLogin(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}verifyTwoFAForAppLogin`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Disable Two Factor Auth by Admin
async function disableTwoFactorAuthByAdmin(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}disableTwoFactorAuthByAdmin`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Send OTP to email for Email verification
async function sendEmailVerificationMail(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}resendUserVerifyEmail`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}

// Verify user email
async function verifyUserEmail(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}userVerifyEmail`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  handleResponse(data);
  return data;
}