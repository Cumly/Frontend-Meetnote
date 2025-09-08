import axios from "axios";

// ======================= AUTH =======================
export const loginGoogle = () => {
  window.location.href = "http://localhost:5000/auth/google/login";
};

export const fetchAndSaveToken = async () => {
  try {
    const res = await axios.get("http://localhost:5000/auth/google/token", {
      withCredentials: true,
    });
    const token = res.data.token;
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
};

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const logoutGoogle = async () => {
  try {
    const response = await API.get("/auth/google/logout");
    return response.data;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  const res = await API.get("/auth/google/user");
  return res.data;
};

// ==================== CALENDAR ======================
export const getReuniones = async () => {
  const res = await API.get("/google/meet/reuniones");
  return res.data;
};

// ===================== DRIVE ========================

export const getArchivosDrive = async () => {
  const token = localStorage.getItem("token"); // obtener token siempre fresco
  const res = await API.get("/google/drive/archivos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const subirArchivoDrive = async (file) => {
  const formData = new FormData();
  formData.append("archivo", file);
  const res = await API.post("/google/drive/subir", formData);
  return res.data;
};

export const editarArchivoDrive = async (fileId, file) => {
  const formData = new FormData();
  formData.append("archivo", file);
  const res = await API.post(`/google/drive/editar/${fileId}`, formData);
  return res.data;
};

export const eliminarArchivoDrive = async (fileId) => {
  const res = await API.delete(`/google/drive/eliminar/${fileId}`);
  return res.data;
};

// =========== GRABACIONES Y TRANSCRIPCIONES ==========
export const getGrabacionesMeet = async (id = null) => {
  const token = localStorage.getItem("token");

  // Llamamos al endpoint existente
  const url = `http://localhost:5000/google/drive/grabaciones`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include", // <--- importante para enviar cookies
  });

  if (!res.ok) {
    console.error("Error al obtener grabaciones:", await res.text());
    return [];
  }

  const grabaciones = await res.json();

  // Filtramos si hay id
  if (id) {
    const encontrada = grabaciones.find((g) => g.id === id);
    return encontrada ? [encontrada] : [];
  }

  return grabaciones;
};

export const getTranscripcionesMeet = async () => {
  const token = await fetchAndSaveToken();
  const res = await fetch(
    "http://localhost:5000/google/drive/transcripciones",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    console.error("Error al obtener transcripciones:", await res.text());
    return [];
  }

  return await res.json();
};

// Función para obtener nombre e ícono (foto) del usuario
export const getUserBasicInfo = async () => {
  const res = await API.get("/auth/google/userinfo");
  return res.data; // { name, photo }
};

export const descargarArchivo = async (id, nombre) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5000/google/drive/descargar/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    console.error("Error descargando archivo:", await res.text());
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  window.URL.revokeObjectURL(url);
};
