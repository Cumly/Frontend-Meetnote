import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/organisms/navbar";
import Sidebar from "../components/organisms/sidebar";

const MainLayout = () => (
  <Box sx={{ display: "flex" }}>
    {/* Navbar fijo */}
    <Navbar />

    {/* Sidebar fijo */}
    <Sidebar />

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 4,
        maxHeight: "50vh",
      }}
    >
      <Toolbar />
      {/* Aquí se renderiza la ruta activa */}
      <Outlet />
    </Box>
  </Box>
);

export default MainLayout;
