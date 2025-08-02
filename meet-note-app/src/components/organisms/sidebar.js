import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";

const drawerWidth = 220;

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openActas, setOpenActas] = useState(false);

  // Abrir submenú automáticamente si estás en una ruta /actas
  useEffect(() => {
    if (currentPath.startsWith("/actas")) {
      setOpenActas(true);
    }
  }, [currentPath]);

  const submenuItems = [
    { text: "Subir transcripción", path: "/actas/subir-transcripcion" },
    { text: "Grabar audio", path: "/actas/grabar-audio" },
    { text: "Obtener Reunión", path: "/actas/obtener-reunion" },
    { text: "Subir grabación", path: "/actas/subir-grabacion" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#0D1B2A",
          borderRight: "none",
          py: 3,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          letterSpacing={1.5}
          color="#90A4AE"
          sx={{ userSelect: "none" }}
        >
          SERVICIOS
        </Typography>
      </Box>

      <List component="nav">
        {/* Home */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <ListItem
            button
            sx={{
              mb: 1,
              borderRadius: 2,
              pl: 3,
              pr: 3,
              color: currentPath === "/" ? "#BBDEFB" : "#B0BEC5",
              "&:hover": { bgcolor: "rgba(21, 101, 192, 0.4)" },
            }}
          >
            <ListItemIcon
              sx={{
                color: currentPath === "/" ? "#BBDEFB" : "#90A4AE",
                minWidth: 36,
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              primaryTypographyProps={{
                fontWeight: currentPath === "/" ? 700 : 500,
                letterSpacing: 0.6,
              }}
            />
          </ListItem>
        </Link>

        {/* Generar Acta (menú principal) */}
        <ListItem
          button
          onClick={() => setOpenActas(!openActas)} // <-- aquí está el click
          sx={{
            mb: 1,
            borderRadius: 2,
            pl: 3,
            pr: 3,
            color: openActas ? "#BBDEFB" : "#B0BEC5",
            "&:hover": { bgcolor: "rgba(21, 101, 192, 0.4)" },
          }}
        >
          <ListItemIcon
            sx={{
              color: openActas ? "#BBDEFB" : "#90A4AE",
              minWidth: 36,
            }}
          >
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText
            primary="Generar Acta"
            primaryTypographyProps={{
              fontWeight: openActas ? 700 : 500,
              letterSpacing: 0.6,
            }}
          />
          {openActas ? (
            <ExpandLess sx={{ color: "#BBDEFB" }} />
          ) : (
            <ExpandMore sx={{ color: "#90A4AE" }} />
          )}
        </ListItem>

        {/* Submenú Actas */}
        <Collapse in={openActas} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {submenuItems.map(({ text, path }) => (
              <Link to={path} key={text} style={{ textDecoration: "none" }}>
                <ListItem
                  button
                  sx={{
                    pl: 6,
                    mb: 0.5,
                    borderRadius: 2,
                    color: currentPath === path ? "#BBDEFB" : "#B0BEC5",
                    "&:hover": {
                      bgcolor: "rgba(21, 101, 192, 0.4)",
                    },
                  }}
                >
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: currentPath === path ? 700 : 500,
                      letterSpacing: 0.5,
                    }}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
        </Collapse>

        {/* Historial */}
        <Link to="/historial" style={{ textDecoration: "none" }}>
          <ListItem
            button
            sx={{
              mb: 1,
              borderRadius: 2,
              pl: 3,
              pr: 3,
              color: currentPath === "/historial" ? "#BBDEFB" : "#B0BEC5",
              "&:hover": { bgcolor: "rgba(21, 101, 192, 0.4)" },
            }}
          >
            <ListItemIcon
              sx={{
                color: currentPath === "/historial" ? "#BBDEFB" : "#90A4AE",
                minWidth: 36,
              }}
            >
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Historial"
              primaryTypographyProps={{
                fontWeight: currentPath === "/historial" ? 700 : 500,
                letterSpacing: 0.6,
              }}
            />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default Sidebar;
