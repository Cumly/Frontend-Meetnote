import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Mic, Stop, Pause, PlayArrow } from "@mui/icons-material";
import ButtonStep from "./buttonsStep";

const AudioRecorder = ({ onBack, onContinue, onCancel, audio }) => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false); // nuevo
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  // ⬅️ NUEVO estado para saber si el usuario ya grabó algo
  const [hasRecorded, setHasRecorded] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Si recibo un audio por props, lo muestro SOLO si no he grabado nada
  useEffect(() => {
    if (audio && !hasRecorded) {
      if (audio instanceof Blob) {
        const url = URL.createObjectURL(audio);
        setAudioURL(url);
        setAudioBlob(audio);
      } else if (typeof audio === "string") {
        setAudioURL(audio);
        setAudioBlob(null);
      }
    }
  }, [audio, hasRecorded]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, {
          type: "audio/webm; codecs=opus",
        });

        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          setAudioBlob(blob);
        } else {
          showError("No se grabó audio. Intenta de nuevo.");
          setAudioURL(null);
          setAudioBlob(null);
        }

        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setPaused(false);
      setElapsedTime(0);
      startTimer(); // ⏱ arranca el cronómetro
      clearError();
    } catch (error) {
      showError("No se pudo acceder al micrófono. Verifica permisos.");
    }
  };

  const handleStartRecordingClick = () => {
    if (audioBlob) {
      setConfirmResetOpen(true); // Mostrar confirmación
    } else {
      startRecording();
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
  };

  const resumeTimer = () => {
    startTimer();
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const confirmResetAndStart = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setConfirmResetOpen(false);
    startRecording();
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      pauseTimer(); // ⏱ pausa
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      resumeTimer(); // ⏱ reanuda
      setPaused(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stopTimer(); // ⏱ resetea
    setRecording(false);
    setPaused(false);
  };

  const showError = (message) => {
    setErrorMsg(message);
    setDialogOpen(true);
  };

  const clearError = () => {
    setDialogOpen(false);
  };

  const handleDialogExited = () => {
    setErrorMsg("");
  };
  // función formateadora
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleContinue = () => {
    if (!audioBlob) {
      showError("Debe grabar un audio antes de continuar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const audioContext = new (window.AudioContext || window.AudioContext)();

      try {
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        const duration = decoded.duration; // en segundos

        if (duration >= 300) {
          // 300s = 5 minutos
          clearError();
          onContinue(audioBlob); // ✅ ahora sí pasa el blob correctamente
        } else {
          showError("El audio debe durar al menos 5 minutos para continuar.");
        }
      } catch (err) {
        showError("No se pudo procesar el audio para validar la duración.");
      }
    };

    reader.readAsArrayBuffer(audioBlob);
  };

  const iconButtonStyle = {
    width: 100,
    height: 100,
    borderRadius: "50%",
    color: "#fff",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // centra horizontal
        justifyContent: "center", // centra vertical (dentro del box)
        textAlign: "center",
        gap: 3,
      }}
    >
      <Stack direction="column" spacing={1} alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Grabadora de Voz
        </Typography>

        <Typography variant="body1" align="center" color="text.secondary">
          Presiona para <b>iniciar</b>, <b>pausar</b>, <b>reanudar</b> o{" "}
          <b>detener</b> la grabación.
        </Typography>
      </Stack>
      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 3,
          border: "2px solid",
          borderColor: recording ? "primary.main" : "grey.300",
          backgroundColor: "grey.100",
          textAlign: "center",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Cronómetro */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color={recording ? "primary" : "text.secondary"}
          gutterBottom
        >
          {formatTime(elapsedTime)}
        </Typography>

        {/* Botones */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
          {!recording && (
            <Stack direction="column" alignItems="center" spacing={1}>
              <IconButton
                onClick={handleStartRecordingClick}
                sx={{ ...iconButtonStyle, backgroundColor: "primary.main" }}
                aria-label="Iniciar grabación"
              >
                <Mic sx={{ fontSize: 42 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Grabar
              </Typography>
            </Stack>
          )}

          {recording && !paused && (
            <Stack direction="column" alignItems="center" spacing={1}>
              <IconButton
                onClick={pauseRecording}
                sx={{ ...iconButtonStyle, backgroundColor: "warning.main" }}
                aria-label="Pausar grabación"
              >
                <Pause sx={{ fontSize: 42 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Pausar
              </Typography>
            </Stack>
          )}

          {recording && paused && (
            <Stack direction="column" alignItems="center" spacing={1}>
              <IconButton
                onClick={resumeRecording}
                sx={{ ...iconButtonStyle, backgroundColor: "info.main" }}
                aria-label="Reanudar grabación"
              >
                <PlayArrow sx={{ fontSize: 42 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Reanudar
              </Typography>
            </Stack>
          )}

          {recording && (
            <Stack direction="column" alignItems="center" spacing={1}>
              <IconButton
                onClick={stopRecording}
                sx={{ ...iconButtonStyle, backgroundColor: "error.main" }}
                aria-label="Detener grabación"
              >
                <Stop sx={{ fontSize: 42 }} />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Detener
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Texto adicional si está pausado */}
        {paused && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Grabación pausada...
          </Typography>
        )}
      </Box>

      {paused && (
        <Typography variant="body2" color="text.secondary" mt={2}>
          Grabación pausada...
        </Typography>
      )}

      {audioURL && (
        <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Previsualización
          </Typography>
          <audio src={audioURL} controls style={{ width: "100%" }} />
        </Box>
      )}

      <Box
        sx={{
          mt: 4,
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ButtonStep
          onBack={onBack}
          hideBack={true}
          onCancel={onCancel}
          onContinue={handleContinue}
        />
      </Box>

      {/* Diálogo de error */}
      <Dialog
        open={dialogOpen}
        onClose={clearError}
        TransitionProps={{ onExited: handleDialogExited }}
        PaperProps={{ sx: { borderRadius: 3, px: 2, py: 1, minWidth: 360 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <ErrorOutlineIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Error al subir archivo
            </Typography>
          </Stack>
          <IconButton onClick={clearError} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Typography color="text.secondary">{errorMsg}</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", pr: 2 }}>
          <Button
            onClick={clearError}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para reiniciar grabación */}
      <Dialog
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, px: 2, py: 1, minWidth: 360 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <ErrorOutlineIcon color="warning" />
            <Typography variant="h6" fontWeight="bold">
              ¿Reiniciar grabación?
            </Typography>
          </Stack>
          <IconButton onClick={() => setConfirmResetOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Typography color="text.secondary">
            Esto eliminará la grabación actual. ¿Quieres continuar?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", pr: 2 }}>
          <Button
            onClick={() => setConfirmResetOpen(false)}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmResetAndStart}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Reiniciar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AudioRecorder;
