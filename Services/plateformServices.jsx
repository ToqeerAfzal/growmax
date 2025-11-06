import config from "../config/config.json";
import CryptoJS from 'crypto-js';
import { headers } from "../APIHelpers/Headers";
import {
  handleResponse,
  headersWithAuth,
  headersWithAuthWithoutBody,
} from "../APIHelpers/Responses";

export const plateformServices = {
  plateFormSettings,
  getPlateformData,
  addNewTransections,
  getTransections,
  getReferralUsers,
  getUserDashboardTransections,
  getUserDashboardEarning,
  getUserDashboardRewardEarning,
  getLevelWiseEarning,
  getTotalReferralHistory,
  getDailyRewardHistory,
  getSelfRewardHistory,
  addNewWidthdrawlRequest,
  getWidthdrawlRequestData,
  getRankDetails,
  getUserRankProgress
};

function decryptResponse(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, config.SECRETKEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

async function getTotalReferralHistory() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getTotalReferralHistory`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getSelfRewardHistory() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getSelfRewardHistory`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getDailyRewardHistory(type) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getDailyRewardHistory/${type}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getPlateformData() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getPlateformData`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getTransections() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getTransections`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserDashboardTransections() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserDashboardTransections`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserDashboardEarning() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserDashboardEarning`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserDashboardRewardEarning() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserDashboardRewardEarning`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getReferralUsers() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getReferralUsers`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getLevelWiseEarning() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getLevelWiseEarning`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function plateFormSettings(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}plateFormSettings`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
}

async function addNewTransections(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}addNewTransections`,
    headersWithAuth("POST", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function addNewWidthdrawlRequest(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}addNewWidthdrawlRequest`,
    headersWithAuth("POST", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function getWidthdrawlRequestData() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getWidthdrawlRequestData`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getRankDetails() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getRankDetails`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

async function getUserRankProgress() {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getUserRankProgress`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}