import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import HomePage from "./pages/homePage";
import FilePage from "./pages/filesPage";
import RecordPage from "./pages/recordPage";
import VideoPage from "./pages/videoPage";
import HistorialPage from "./pages/historialPage";
import MeetPage from "./pages/meetPage";
import { fetchAndSaveToken } from "../src/services/googleService";
import { Box } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const token = await fetchAndSaveToken(); // Debería lanzar error si no hay sesión
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("No hay sesión activa aún");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fff",
        }}
      ></Box>
    );
  }

  if (!isAuthenticated) {
    return null; // ya se redirigió a Google
  }

  // Si hay sesión, renderiza todo
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="actas/subir-transcripcion" element={<FilePage />} />
          <Route path="actas/grabar-audio" element={<RecordPage />} />
          <Route path="actas/obtener-reunion" element={<MeetPage />} />
          <Route path="actas/subir-grabacion" element={<VideoPage />} />
          <Route path="historial" element={<HistorialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
