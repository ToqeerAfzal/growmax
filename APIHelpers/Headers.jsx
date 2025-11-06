import { authHeader } from "./auth-header";

let headerSet = authHeader();

export const headers = {
  authorization: headerSet.Authorization,
  "content-type": "application/json",
};