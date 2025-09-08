import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/generateActaFromInput";

export const transcribeVideo = async (
  file,
  título,
  fecha,
  horaInicio,
  horaFin,
  participantes
) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 👈 Este debe ser tipo File o Blob
    formData.append("titulo", título);
    formData.append("fecha", fecha);
    formData.append("horaInicio", horaInicio);
    formData.append("horaFin", horaFin);
    formData.append("participantes", participantes.join(",")); // 👈 Solo texto

    const response = await axios.post(
      `${BASE_URL}/getTranscriptionByVideo/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Error desconocido" };
  }
};

export const transcribeText = async (
  file,
  título,
  fecha,
  horaInicio,
  horaFin,
  participantes
) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 👈 Este debe ser tipo File o Blob
    formData.append("titulo", título);
    formData.append("fecha", fecha);
    formData.append("horaInicio", horaInicio);
    formData.append("horaFin", horaFin);
    formData.append("participantes", participantes.join(",")); // 👈 Solo texto

    const response = await axios.post(
      `${BASE_URL}/getTranscriptionByText/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Error desconocido" };
  }
};

export const trancribeAudio = async (
  file,
  título,
  fecha,
  horaInicio,
  horaFin,
  participantes
) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 👈 Este debe ser tipo File o Blob
    formData.append("titulo", título);
    formData.append("fecha", fecha);
    formData.append("horaInicio", horaInicio);
    formData.append("horaFin", horaFin);
    formData.append("participantes", participantes.join(",")); // 👈 Solo texto

    const response = await axios.post(
      `${BASE_URL}/getTranscriptionByAudio/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Error desconocido" };
  }
};

export const trancribeGoogle = async (
  file,
  token,
  plataform,
  título,
  fecha,
  horaInicio,
  horaFin,
  participantes
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("plataforma", plataform);
    formData.append("titulo", título);
    formData.append("fecha", fecha);
    formData.append("horaInicio", horaInicio);
    formData.append("horaFin", horaFin);
    formData.append("participantes", participantes.join(",")); // 👈 Solo texto

    const response = await axios.post(
      `${BASE_URL}/getTranscriptionByMeeting/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Error desconocido" };
  }
};
