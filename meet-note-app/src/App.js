import React, { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import HomePage from "./pages/homePage";
import FilePage from "./pages/filesPage";
import RecordPage from "./pages/recordPage";
import VideoPage from "./pages/videoPage";
import HistorialPage from "./pages/historialPage";
import MeetPage from "./pages/meetPage";
import { logoutGoogle, fetchAndSaveToken } from "../src/services/googleService"; // Asegúrate de importar la función logoutGoogle

function App() {
  const { loading } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logoutGoogle(); // Llamamos a la API para cerrar sesión
      // Aquí podrías redirigir al usuario a la página de login
      window.location.href = "/auth/google/login"; // O usa navigate para redirigir si es necesario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    // Intenta obtener token solo cuando el componente monta
    fetchAndSaveToken().catch(() => {
      console.log("No hay sesión activa aún");
    });
  }, []);
  if (loading) return null; // o un spinner

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
