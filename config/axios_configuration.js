import axios from "axios";
// constants
import { BASE_STAGING, BASE_LOCAL, BASE_PROD } from "constants/api_routes";

if (process.env.APP_ENV === "staging" || process.env.APP_ENV === "local") {
  axios.defaults.baseURL = BASE_STAGING;
} else if (process.env.APP_ENV === "production") {
  axios.defaults.baseURL = BASE_PROD;
} else {
  axios.defaults.baseURL = BASE_LOCAL;
}

export function setAxiosHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
  }
}
