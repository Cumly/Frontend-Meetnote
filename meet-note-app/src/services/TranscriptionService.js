import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/generateActaFromInput";

export const transcribeVideo = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id); // 👈 Este debe ser tipo File o Blob

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

export const transcribeText = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file); // 👈 Este debe ser tipo File o Blob

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

export const trancribeAudio = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file); //
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

export const trancribeMeet = async (file, token, plataform, id) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);
    formData.append("token", token);
    formData.append("plataforma", plataform);

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
