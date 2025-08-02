import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import ProfileAvatar from "./ProfileAvatar";

const Navbar = ({ userPhoto, onLogout }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        bgcolor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #e0e0e0",
      }}
      elevation={0}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: 64,
        }}
      >
        {/* Logo a la izquierda */}
        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          sx={{ userSelect: "none", cursor: "default" }}
        >
          MeetNote
        </Typography>

        {/* Icono perfil a la derecha */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ProfileAvatar userPhoto={userPhoto} onLogout={onLogout} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
