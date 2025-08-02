import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import HomePage from "./pages/homePage";
import FilePage from "./pages/filesPage";
import RecordPage from "./pages/recordPage";
import VideoPage from "./pages/videoPage";
import HistorialPage from "./pages/historialPage";
import RequireAuth from "./services/RequireAuth";
import MeetPage from "./pages/meetPage";

function App() {
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
