import React, { useState, useRef } from "react";
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
import { Mic, Stop } from "@mui/icons-material";
import ButtonStep from "./buttonsStep";

const AudioRecorder = ({ onBack, onContinue, onCancel }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

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
      clearError();
    } catch (error) {
      showError("No se pudo acceder al micrófono. Verifica permisos.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
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

  const handleContinue = () => {
    if (!audioBlob) {
      showError("Debe seleccionar un audio antes de continuar.");
      return;
    }

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(audioBlob);

    const validarDuracion = () => {
      if (audio.duration >= 60) {
        clearError();
        onContinue(audioBlob); // PASAMOS EL AUDIO AL PADRE
      } else {
        showError("El audio debe durar al menos 1 minuto para continuar.");
      }
    };

    if (audio.readyState >= 1) {
      validarDuracion();
    } else {
      audio.onloadedmetadata = validarDuracion;
      audio.onerror = () => {
        showError("No se pudo cargar el audio para validar la duración.");
      };
    }
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
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Grabadora de Voz
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" mb={3}>
        Presiona para <b>Iniciar</b> o <b>detener</b> la grabación.
      </Typography>

      <Box>
        <IconButton
          onClick={recording ? stopRecording : startRecording}
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: recording ? "error.main" : "primary.main",
            color: "#fff",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: recording ? "error.dark" : "primary.dark",
              transform: "scale(1.05)",
            },
          }}
          aria-label={recording ? "Detener grabación" : "Iniciar grabación"}
        >
          {recording ? (
            <Stop sx={{ fontSize: 42 }} />
          ) : (
            <Mic sx={{ fontSize: 42 }} />
          )}
        </IconButton>
      </Box>

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
          onCancel={onCancel}
          onContinue={handleContinue}
        />
      </Box>

      {/* Dialogo de error con diseño estilo UploadStep */}
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
    </Box>
  );
};

export default AudioRecorder;
