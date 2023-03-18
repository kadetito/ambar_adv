import axios from "axios";
import { getEnvVariables } from "../utils";

const { VITE_API_URL } = getEnvVariables();

const patientApi = axios.create({
  baseURL: VITE_API_URL,
});

//INTERCEPTORS
patientApi.interceptors.request.use((config: any) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default patientApi;
