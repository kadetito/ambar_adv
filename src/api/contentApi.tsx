import axios from "axios";
import { getEnvVariables } from "../utils/";

const { VITE_API_URL } = getEnvVariables();

const contentApi = axios.create({
  baseURL: "https://staging-2.ambarpartners.net",
});
const requestLocal = localStorage.getItem("authbasic");

//INTERCEPTORS
contentApi.interceptors.request.use(
  (config: any) => {
    config.headers = {
      // "x-token": localStorage.getItem("token"),
      // "x-token": localStorage.getItem("token"),
      // "Access-Control-Allow-Origin": "*",
      // "Content-type": "application/json;charset=utf-8",
      // Accept: "application/json",
      // Authorization: "Basic " + requestLocal,
      ...config.headers,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default contentApi;
