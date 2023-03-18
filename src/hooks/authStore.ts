import { useDispatch, useSelector } from "react-redux";
import { Buffer } from "buffer";
import jwt from "jwt-decode";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../redux/auth";
import { contentApi } from "../api";
import encodeUtf8 from "encode-utf8";
import axios from "axios";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(
    (state: any) => state.auth
  );
  const dispatch = useDispatch();

  const startLogin = async ({ username, password }: any) => {
    dispatch(onChecking());
    try {
      const heads = { "Content-type": "application/json" };
      const dataSend = {
        username,
        password,
      };
      const authBasic = `${username}:${password}`;
      const bytes = encodeUtf8(authBasic);
      const encodedToken = Buffer.from(bytes).toString("base64");
      localStorage.setItem("authbasic", encodedToken);
      const requestLocal = localStorage.getItem("authbasic");

      const { data, request } = await contentApi.get(
        "/api/products/"
        //dataSend

        //{
        //   headers: heads,
        // "x-token": localStorage.getItem("token"),
        // "x-token": localStorage.getItem("token"),
        // "Access-Control-Allow-Origin": "*",

        // Accept: "application/json",
        // Authorization: "Basic " + requestLocal,
        //  }
      );
      console.log(data);
      const timeDate: any = new Date().getTime();
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-time", timeDate.toString());
      localStorage.setItem("avatar", data.avatar);

      const infotoken: any = jwt(data.token);
      dispatch(
        onLogin({
          name: data.name,
          uid: data.uid,
          level: data.level,
        })
      );
    } catch (error) {
      console.log({ error });
      dispatch(onLogout("credenciales incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  //renewtoken
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout(""));
    try {
      const { data } = await contentApi.get("auth/renew");
      const timeDate: any = new Date().getTime();
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-time", timeDate.toString());
      const infotoken: any = jwt(data.token);
      dispatch(
        onLogin({
          name: data.name,
          uid: data.uid,
          level: infotoken.level,
        })
      );
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout(""));
    }
  };

  //logout
  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout(""));
  };

  return {
    //properties
    status,
    user,
    errorMessage,
    //methods
    startLogin,
    checkAuthToken,
    startLogout,
  };
};
