import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/organisms/navbar";
import Sidebar from "../components/organisms/sidebar";

const MainLayout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "98vh" }}>
    {/* Navbar */}
    <Navbar />

    <Box sx={{ display: "flex", flexGrow: 1 }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          pt: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>

    {/* Footer */}
    <Box
      component="footer"
      sx={{
        py: 2,
        bgcolor: "#fff3cd",
        color: "#856404",
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: 500,
        borderTop: "1px solid #ffeeba",
        width: "100%",
      }}
    >
      ⚠️ Esta aplicación maneja información sensible. Maneje los datos con
      cuidado.
    </Box>
  </Box>
);

export default MainLayout;
