// src/components/organisms/UploadStep.js
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import FileDrop from "../molecules/fileDrop";
import FilePreview from "../molecules/filePreview";
import ButtonStep from "../molecules/buttonsStep";

const UploadStep = ({
  allowedExtensions = ["txt", "mp4"],
  file: externalFile,
  onContinue,
  onCancel,
  onFileSelected,
}) => {
  const [file, setFile] = useState(externalFile || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const extensionListText = allowedExtensions.map((e) => `.${e}`).join(" o ");

  useEffect(() => {
    if (externalFile) {
      setFile(externalFile);
    }
  }, [externalFile]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Solo se permiten archivos ${extensionListText}`);
      setDialogOpen(true);
      setFile(null);
      return false;
    }

    setErrorMessage("");
    setFile(selectedFile);
    if (onFileSelected) onFileSelected(selectedFile);
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const handleContinue = () => {
    if (!file) {
      setErrorMessage("Debe seleccionar un archivo antes de continuar.");
      setDialogOpen(true);
      return;
    }
    setErrorMessage("");
    onContinue();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setErrorMessage("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 650,
          width: 700,
          height: 550,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "background.paper",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
            Subir archivo
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            mb={3}
          >
            Arrastra un archivo <b>{extensionListText}</b> o selecciónalo
            manualmente para subirlo.
          </Typography>
          <input
            type="file"
            accept={allowedExtensions.map((e) => `.${e}`).join(",")}
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <FileDrop
            dragOver={dragOver}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onButtonClick={() => fileInputRef.current?.click()}
            allowedExtensions={allowedExtensions}
          />
          <FilePreview
            file={file}
            onRemove={() => {
              setFile(null);
              if (onFileSelected) onFileSelected(null);
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <ButtonStep
            hideBack={true}
            onBack={() => console.log("Atrás")}
            onCancel={onCancel}
            onContinue={handleContinue}
          />
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 3, px: 2, py: 1, minWidth: 360 },
        }}
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
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <Typography color="text.secondary">{errorMessage}</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", pr: 2 }}>
          <Button
            onClick={handleCloseDialog}
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

export default UploadStep;
