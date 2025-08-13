// src/services/zoomService.js
import axios from "axios";

// URL base de tu backend FastAPI
const API_BASE = "http://localhost:8000";

export const loginZoom = () => {
  // Redirige a /login en tu backend (inicia OAuth con Zoom)
  window.location.href = `${API_BASE}/login`;
};

export const getTranscripcionesZoom = async (accessToken) => {
  try {
    const { data } = await axios.get(`${API_BASE}/transcriptions`, {
      params: { access_token: accessToken },
    });

    if (data.transcriptions) {
      return data.transcriptions.map((t) => ({
        titulo: t.meeting_topic || "Sin título",
        fecha: t.start_time,
        organizador: "Zoom", // Puedes ajustarlo si hay datos de host
        participantes: [],
        grabacion: null, // No lo devuelve el backend, solo transcripciones
        transcripcion: t.transcription_url,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener transcripciones de Zoom:", error);
    return [];
  }
};

export const logoutZoom = () => {
  // Simplemente eliminamos el token de localStorage
  localStorage.removeItem("zoom_access_token");
  window.location.reload();
};

// Función para leer el token que viene del backend por query params
export const getZoomAccessTokenFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("zoom_access_token");
  if (token) {
    localStorage.setItem("zoom_access_token", token);
    // Limpiar la URL para que no quede el token visible
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }
  return localStorage.getItem("zoom_access_token");
};
