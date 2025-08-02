import axios from "axios";

// src/services/authService.js
import Cookies from "js-cookie";

export async function uploadFileApi(token, file) {
  if (!token) throw new Error("No Microsoft token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:8000/onedrive/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

const AUTH_COOKIE_MS = "access_token";
const AUTH_COOKIE_ZOOM = "zoom_access_token";

const MICROSOFT_LOGOUT_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000/";

export const logout = () => {
  Cookies.remove(AUTH_COOKIE_MS, { path: "/" });
  Cookies.remove(AUTH_COOKIE_ZOOM, { path: "/" });
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = MICROSOFT_LOGOUT_URL;
};
