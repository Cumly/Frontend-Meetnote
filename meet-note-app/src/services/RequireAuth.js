// src/components/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { CircularProgress, Box } from "@mui/material";

const RequireAuth = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedMicrosoftToken = Cookies.get("access_token");
    const params = new URLSearchParams(window.location.search);
    const msToken = params.get("access_token");

    if (storedMicrosoftToken) {
      setToken(storedMicrosoftToken);
      setLoading(false);
    } else if (msToken) {
      Cookies.set("access_token", msToken, { expires: 1 });
      setToken(msToken);
      window.history.replaceState({}, document.title, "/");
      setLoading(false);
    } else {
      window.location.href = "http://127.0.0.1:5000/auth/microsoft/login";
    }
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
