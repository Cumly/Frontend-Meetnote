import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ButtonStep from "../molecules/buttonsStep";
import {
  loginGoogle,
  getReuniones,
  getGrabacionesMeet,
  fetchAndSaveToken,
} from "../../services/googleService";
import {
  loginZoom,
  getZoomAccessTokenFromURL,
  getReunionesYGrabacionesZoom,
} from "../../services/zoomService";

const MeetStep = ({
  platform,
  setPlatform,
  selectedMeeting,
  setSelectedMeeting,
  onContinue,
  onCancel,
  handleSelectMeeting,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zoomToken, setZoomToken] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false); // ✅ cambio aquí

  const handlePlatformChange = (_, newPlatform) => {
    setPlatform(newPlatform);
    setMeetings([]);
    setFilteredMeetings([]);
    setSelectedMeeting(null);
    setAuthenticated(false);
    setSearchTerm("");
    setError("");
  };

  const fetchReunionesZoom = async (token) => {
    setLoading(true);
    setLoadingAuth(true);
    try {
      const reuniones = (await getReunionesYGrabacionesZoom(token)) || [];

      // Formatear reuniones para manejo interno y key, sin filtrar
      const reunionesFormateadas = reuniones.map((r, index) => ({
        ...r,
        zoomId: r.id, // ID real de Zoom
        id: index, // Para key y manejo interno
        token, // Guardar token por si se necesita después
      }));

      setMeetings(reunionesFormateadas);
      setFilteredMeetings(reunionesFormateadas);
      setAuthenticated(true);
    } catch (err) {
      console.error("Error al obtener reuniones de Zoom:", err);
      setAuthenticated(false);
    } finally {
      setLoading(false);
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    const token = getZoomAccessTokenFromURL();
    if (platform === "zoom" && token) {
      setZoomToken(token);
      fetchReunionesZoom(token);
    }
  }, [platform]);

  const handleLogin = async () => {
    if (platform === "google") {
      loginGoogle();
    } else if (platform === "zoom") {
      try {
        const redirectUrl = await loginZoom();
        window.open(redirectUrl, "_blank");
      } catch (err) {
        console.error("Error al iniciar sesión en Zoom:", err);
      }
    }
  };

  const fetchReunionesGoogle = async () => {
    setLoading(true);
    setLoadingAuth(true);
    try {
      const reuniones = await getReuniones();
      const grabaciones = await getGrabacionesMeet();

      const reunionesConGrabacion = (reuniones || []).filter((r) =>
        grabaciones.some(
          (g) => g.name.includes(r.titulo) || g.name.includes(r.fecha)
        )
      );

      setMeetings(reunionesConGrabacion);
      setFilteredMeetings(reunionesConGrabacion);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error al obtener reuniones de Google:", error);
      setAuthenticated(false);
    }
    setLoading(false);
    setLoadingAuth(false);
  };

  useEffect(() => {
    if (platform === "google") fetchReunionesGoogle();
    else setMeetings([]);
  }, [platform]);

  useEffect(() => {
    if (searchTerm.trim() === "") setFilteredMeetings(meetings);
    else {
      const term = searchTerm.toLowerCase();
      setFilteredMeetings(
        meetings.filter((m) => (m.titulo || "").toLowerCase().includes(term))
      );
    }
  }, [searchTerm, meetings]);

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === "string" && fecha.includes("T")) {
      return fecha.split("T")[0]; // Devuelve solo 'YYYY-MM-DD'
    }
    return fecha; // Si ya viene bien, no la toques
  };

  const handleContinue = () => {
    console.log("entre");
    if (!selectedMeeting) {
      setError("Por favor, selecciona una reunión antes de continuar.");
      return;
    }
    onContinue();
  };

  const handleMeetingClick = async (meeting, meetingId) => {
    setLoading(true);

    try {
      let token;
      let grabacionData = null;

      setSelectedMeeting(meeting);

      if (platform === "google") {
        token = await fetchAndSaveToken();
        const grabaciones = await getGrabacionesMeet();

        const grabacionMatch = grabaciones.find(
          (file) =>
            file.name.includes(meeting.titulo) ||
            file.name.includes(meeting.fecha)
        );

        grabacionData = grabacionMatch ? { fileId: grabacionMatch.id } : null;
      } else if (platform === "zoom") {
        token = zoomToken;

        console.log(token);

        console.log("Reunión Zoom completa:", meeting);

        // Usamos la propiedad correcta: "descargar"
        grabacionData = meeting.grabaciones?.length
          ? {
              descargar: meeting.grabaciones[0].descargar,
              fileId: meeting.grabaciones[0].id,
            }
          : null;

        console.log("Download URL seleccionado:", grabacionData?.descargar);
        console.log("ID seleccionado:", grabacionData?.fileId);
      }

      const meetingData = {
        ...meeting,
        meetingId,
        grabacion: grabacionData,
        token,
      };
      console.log("ID seleccionado:", grabacionData?.fileId);
      setSelectedMeeting(meetingData);
      handleSelectMeeting(meetingData);
      setError("");
    } catch (error) {
      console.error("Error al seleccionar la reunión:", error);
      setSelectedMeeting({ ...meeting, meetingId });
      setError("");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 610,
        mx: "auto",
        mt: 6,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 6,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Accede a las reuniones
      </Typography>
      <Typography color="text.secondary">
        Selecciona la plataforma donde realizaste la reunión:
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <ToggleButtonGroup
          value={platform}
          exclusive
          onChange={handlePlatformChange}
          sx={{
            gap: 2,
            "& .MuiToggleButton-root": {
              px: 5,
              py: 1.6,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              border: "1px solid #ccc",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "#e3f2fd" },
            },
            "& .MuiToggleButton-root.Mui-selected": {
              bgcolor: "primary.main",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
            },
          }}
        >
          <ToggleButton value="zoom">Zoom</ToggleButton>
          <ToggleButton value="google">Google Meet</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {platform && authenticated && (
        <TextField
          label="Buscar por título"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            borderRadius: 3,
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        />
      )}

      {!authenticated && platform && !loadingAuth && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{
              px: 6,
              py: 1.8,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 3,
              textTransform: "none",
              background: "linear-gradient(to right, #42a5f5, #1e88e5)",
              boxShadow: "0 6px 16px rgba(33,150,243,0.4)",
              "&:hover": {
                background: "linear-gradient(to right, #1e88e5, #1565c0)",
                boxShadow: "0 8px 24px rgba(21,101,192,0.5)",
              },
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {platform && authenticated && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 300,
            height: 300,
            borderRadius: 2,
            overflowY: "auto",
            px: 1,
            p: 1,
            border: "1px solid #ccc",
            backgroundColor: "#ffffff",
          }}
        >
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting, index) => {
              const meetingId =
                meeting.id ||
                meeting.zoomId ||
                `${meeting.titulo}-${meeting.fecha}` ||
                index;
              const isSelected = selectedMeeting?.meetingId === meetingId;

              return (
                <Card
                  key={meetingId}
                  onClick={() => handleMeetingClick(meeting, meetingId)}
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                    backgroundColor: isSelected ? "#e3f2fd" : "#ffffff",
                    boxShadow: isSelected
                      ? "0 4px 10px rgba(25,118,210,0.2)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#bcddffff" },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: "70%",
                      }}
                      title={meeting.titulo}
                    >
                      {meeting.titulo || "Sin título"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "right" }}
                    >
                      {formatFecha(meeting.fecha)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Typography color="text.secondary" textAlign="center" mt={2}>
              No se encontraron reuniones con grabaciones o transcripciones.
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Box>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      <Box mt={4} textAlign="right">
        <ButtonStep
          hideBack={true}
          onBack={() => console.log("Atrás")}
          onCancel={onCancel}
          onContinue={handleContinue}
        />
      </Box>
    </Box>
  );
};

export default MeetStep;
