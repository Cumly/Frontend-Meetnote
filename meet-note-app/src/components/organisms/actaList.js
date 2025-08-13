import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  List,
  ListItemButton,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  getArchivosDrive,
  eliminarArchivoDrive,
  descargarArchivo,
} from "../../services/googleService";

const DriveFileViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await getArchivosDrive();
      setFiles(data);
      setSelectedFile(data[0] || null);
    } catch (err) {
      console.error("Error al obtener archivos:", err);
    } finally {
      setLoading(false);
    }
  };
  const getDownloadUrl = (file) => {
    // Enlace para descarga directa
    return `https://drive.google.com/uc?export=download&id=${file.id}`;
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedFile) return;
    try {
      await eliminarArchivoDrive(selectedFile.id);
      const updatedFiles = files.filter((f) => f.id !== selectedFile.id);
      setFiles(updatedFiles);
      setSelectedFile(updatedFiles[0] || null);
      setDialogOpen(false);
    } catch (err) {
      console.error("Error al eliminar archivo:", err);
    }
  };

  const getDrivePreviewUrl = (file) => {
    if (!file || !file.id) return "";
    return `https://drive.google.com/file/d/${file.id}/preview`;
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [files, searchTerm]
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          display: "flex",
          gap: 3,
          bgcolor: "#f7f9fc",
          p: 3,
          borderRadius: 4,
        }}
      >
        {/* Lista de archivos */}
        <Paper
          elevation={4}
          sx={{
            width: "30%",
            p: 3,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            color="primary.main"
            sx={{ letterSpacing: 1 }}
          >
            📂 Actas Generadas
          </Typography>
          <TextField
            fullWidth
            size="medium"
            placeholder="Buscar archivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ my: 2 }}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            autoFocus
            variant="outlined"
          />
          <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />
          {loading ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 5,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <List
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#90caf9 transparent",
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#90caf9",
                  borderRadius: 4,
                },
              }}
            >
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <ListItemButton
                    key={file.id}
                    selected={selectedFile?.id === file.id}
                    onClick={() => setSelectedFile(file)}
                    sx={{
                      borderRadius: 3,
                      mb: 1,
                      py: 1.2,
                      transition: "background-color 0.25s ease",
                      "&.Mui-selected": {
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                        "&:hover": {
                          bgcolor: "primary.main",
                        },
                      },
                      "&:hover": {
                        bgcolor: "primary.lighter",
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 0.3,
                    }}
                  >
                    <Typography noWrap variant="subtitle1">
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                      noWrap
                    >
                      {file.mimeType}
                    </Typography>
                  </ListItemButton>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mt: 5 }}
                >
                  No hay archivos.
                </Typography>
              )}
            </List>
          )}
        </Paper>

        {/* Vista previa */}
        <Paper
          elevation={4}
          sx={{
            flexGrow: 1,
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            color="primary.main"
            sx={{ letterSpacing: 1 }}
          >
            📄 Vista previa
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />

          {selectedFile ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgb(0 0 0 / 0.05)",
                  bgcolor: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedFile.mimeType.includes("image/") && (
                  <img
                    src={selectedFile.webContentLink}
                    alt={selectedFile.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}
                {(selectedFile.mimeType === "application/pdf" ||
                  selectedFile.mimeType.startsWith("text/")) && (
                  <iframe
                    title={`Preview of ${selectedFile.name}`}
                    src={getDrivePreviewUrl(selectedFile)}
                    style={{
                      border: "none",
                      flex: 1,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
                {!selectedFile.mimeType.includes("image/") &&
                  selectedFile.mimeType !== "application/pdf" &&
                  !selectedFile.mimeType.startsWith("text/") && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, textAlign: "center", fontStyle: "italic" }}
                    >
                      Vista previa no disponible para este tipo de archivo.
                    </Typography>
                  )}
              </Box>

              {/* Botones Descargar y Eliminar */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-start"
              >
                <Button
                  onClick={() =>
                    descargarArchivo(selectedFile.id, selectedFile.name)
                  }
                  download
                  target="_blank"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Descargar
                </Button>
                <Button
                  startIcon={<DeleteForeverIcon />}
                  color="error"
                  variant="outlined"
                  size="large"
                  sx={{ minWidth: 140 }}
                  onClick={() => setDialogOpen(true)}
                >
                  Eliminar
                </Button>
              </Stack>
            </>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 10, fontStyle: "italic" }}
            >
              Selecciona un archivo para ver la vista previa.
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
            fontWeight: 700,
          }}
        >
          <WarningAmberIcon color="error" />
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={16}>
            ¿Estás seguro de que deseas eliminar{" "}
            <strong>{selectedFile?.name}</strong>? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} size="large">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            size="large"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DriveFileViewer;
