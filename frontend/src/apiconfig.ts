import axios from "axios";
import config from "./config";

export const apiServer = axios.create({
  baseURL: `${config.apiServer}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiServerAuth = axios.create({
  baseURL: `${config.apiServer}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});
