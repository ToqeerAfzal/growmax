import config from "../config/config.json";
import axios from "axios";
import CryptoJS from 'crypto-js';
import { headers } from "../APIHelpers/Headers";
import {
  handleResponse,
  headersWithAuth,
  headersWithAuthWithoutBody,
} from "../APIHelpers/Responses";

export const packageServices = {
  addNewPackages,
  updatePackageData,
  deletePackageData,
  getPackageData,
  getPackageDataNoAuth
};

function decryptResponse(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, config.SECRETKEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

async function addNewPackages(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}addNewPackages`,
    headersWithAuth("POST", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function updatePackageData(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}updatePackageData`,
    headersWithAuth("PUT", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function deletePackageData(userData) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}deletePackageData`,
    headersWithAuth("DELETE", userData, headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  await handleResponse(data);
  return data
}

async function getPackageData(type) {
  const response = await fetch(
    `${config.API_URL_USER_ONBOARDING}getPackageData/${type}`,
    headersWithAuthWithoutBody("GET", headers)
  );
  const json = await response.json()
  const data = decryptResponse(json.encrypted);
  return data;
}

export async function getPackageDataNoAuth() {
  try {
    const response = await axios.get(
      `${config.API_URL_USER_ONBOARDING}getPackageData`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package data (no auth):", error);
    return { data: [] }; // fallback structure
  }
}