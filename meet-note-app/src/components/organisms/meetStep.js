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
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ButtonStep from "../molecules/buttonsStep";
import {
  loginGoogle,
  getReuniones,
  getGrabacionesMeet,
  getTranscripcionesMeet,
} from "../../services/googleService";
import {
  loginZoom,
  getTranscripcionesZoom,
  getZoomAccessTokenFromURL,
  logoutZoom,
} from "../../services/zoomService";

const MeetStep = () => {
  const [platform, setPlatform] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlatformChange = (_, newPlatform) => {
    setPlatform(newPlatform);
    setMeetings([]);
    setSelectedMeeting(null);
    setAuthenticated(false);
  };

  const handleLogin = () => {
    if (platform === "google") {
      loginGoogle();
    }
    // No se implementa loginZoom ni lógica para Zoom en esta versión
  };

  const fetchReunionesGoogle = async () => {
    setLoading(true);
    try {
      const data = await getReuniones();
      setMeetings(data || []);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error al obtener reuniones de Google:", error);
      setAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (platform === "google") {
      fetchReunionesGoogle();
    } else {
      // Zoom no cargará reuniones en esta versión
      setMeetings([]);
      setAuthenticated(false);
    }
  }, [platform]);

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha inválida";
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) return "Fecha inválida";
    return fecha.toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleMeetingClick = async (meeting) => {
    setLoading(true);
    try {
      if (platform === "google") {
        const [grabaciones, transcripciones] = await Promise.all([
          getGrabacionesMeet(),
          getTranscripcionesMeet(),
        ]);

        const grabacionMatch = grabaciones.find(
          (file) =>
            file.name.includes(meeting.titulo) ||
            file.name.includes(meeting.fecha)
        );

        const transcripcionMatch = transcripciones.find(
          (file) =>
            file.name.includes(meeting.titulo) ||
            file.name.includes(meeting.fecha)
        );

        setSelectedMeeting({
          ...meeting,
          grabacion: grabacionMatch
            ? grabacionMatch.webContentLink || grabacionMatch.webViewLink
            : null,
          transcripcion: transcripcionMatch
            ? transcripcionMatch.webContentLink ||
              transcripcionMatch.webViewLink
            : null,
        });

        if (!grabacionMatch && !transcripcionMatch) {
          setShowModal(true);
        }
      } else {
        // Zoom no implementado, solo mostrar reunión sin archivos
        setSelectedMeeting(meeting);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al cargar archivos de la reunión:", error);
      setSelectedMeeting(meeting);
      setShowModal(true);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
        Accede a las reuniones
      </Typography>

      <Typography textAlign="center" mb={2}>
        Elige la plataforma donde realizaste la reunión:
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <ToggleButtonGroup
          value={platform}
          exclusive
          onChange={handlePlatformChange}
          sx={{
            gap: 2,
            "& .MuiToggleButton-root": {
              px: 4,
              py: 1.6,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              border: "1px solid #ccc",
              color: "#333",
              background: "#fafafa",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                borderColor: "primary.main",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              },
            },
            "& .MuiToggleButton-root.Mui-selected": {
              bgcolor: "primary.main",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 5px 15px rgba(25,118,210,0.4)",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            },
          }}
        >
          <ToggleButton value="zoom">Zoom</ToggleButton>
          <ToggleButton value="google">Google Meet</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {platform && (
        <>
          {!authenticated ? (
            <Box textAlign="center">
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={{
                  px: 5,
                  py: 1.7,
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 3,
                  textTransform: "none",
                  background: "linear-gradient(to right, #42a5f5, #1e88e5)",
                  boxShadow: "0 6px 16px rgba(33, 150, 243, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(to right, #1e88e5, #1565c0)",
                    boxShadow: "0 8px 24px rgba(21, 101, 192, 0.5)",
                  },
                }}
              >
                Iniciar sesión en {platform === "google" ? "Google" : "Zoom"}
              </Button>
            </Box>
          ) : loading ? (
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
          ) : meetings.length > 0 ? (
            <>
              <Box display="grid" gap={2} mb={3}>
                {meetings.map((meeting, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleMeetingClick(meeting)}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        {meeting.titulo || "Sin título"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Fecha: {formatFecha(meeting.fecha)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PersonIcon fontSize="small" />
                        <Typography variant="body2">
                          Organizador: {meeting.organizador || "Desconocido"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <GroupIcon fontSize="small" />
                        <Typography variant="body2">
                          Participantes:{" "}
                          {meeting.participantes?.join(", ") ||
                            "No disponibles"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {selectedMeeting &&
                (selectedMeeting.grabacion ||
                  selectedMeeting.transcripcion) && (
                  <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
                    <Typography variant="h6" mb={2}>
                      Archivos de la reunión:{" "}
                      {selectedMeeting.titulo || "Sin título"}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {selectedMeeting.grabacion && (
                        <Chip
                          label="Descargar grabación"
                          color="primary"
                          onClick={() => window.open(selectedMeeting.grabacion)}
                          icon={<DownloadIcon />}
                          clickable
                        />
                      )}
                      {selectedMeeting.transcripcion && (
                        <Chip
                          label="Descargar transcripción"
                          color="secondary"
                          onClick={() =>
                            window.open(selectedMeeting.transcripcion)
                          }
                          icon={<DownloadIcon />}
                          clickable
                        />
                      )}
                    </Box>
                  </Box>
                )}

              {/* Modal de reunión sin archivos */}
              <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogTitle>Sin archivos disponibles</DialogTitle>
                <DialogContent>
                  <Typography>
                    Esta reunión no tiene grabación ni transcripción.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setShowModal(false)}
                    color="primary"
                    autoFocus
                  >
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Typography textAlign="center" color="text.secondary" mt={3}>
              No se encontraron reuniones con grabaciones o transcripciones.
            </Typography>
          )}
        </>
      )}

      <Box mt={4} textAlign="right">
        <ButtonStep
          hideBack={true}
          onBack={() => console.log("Atrás")}
          onCancel={() => console.log("Cancelar")}
          onContinue={() => console.log("Continuar")}
        />
      </Box>
    </Box>
  );
};

export default MeetStep;
