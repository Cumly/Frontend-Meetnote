import React, { useState } from "react";
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
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ButtonStep from "../molecules/buttonsStep";

const neutralScrollbar = {
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "#f0f0f0",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#b0b0b0",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#909090",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#b0b0b0 #f0f0f0",
};

const ActaList = ({ ms = [], onDelete }) => {
  const [notes, setNotes] = useState(ms);
  const [selectedNote, setSelectedNote] = useState(ms[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    if (!selectedNote) return;
    const element = document.createElement("a");
    const file = new Blob(
      [
        `${selectedNote.title}\n${selectedNote.date}\n\n${selectedNote.content}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${selectedNote.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteConfirm = () => {
    const updatedNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(updatedNotes);
    setSelectedNote(updatedNotes[0] || null);
    setDialogOpen(false);
    if (onDelete) onDelete(selectedNote);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {/* Lista de actas */}
        <Box
          sx={{
            width: "30%",
            borderRight: 1,
            borderColor: "divider",
            overflowY: "auto",
            p: 2,
            ...neutralScrollbar,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reuniones
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Buscar actas..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          <List disablePadding>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <ListItemButton
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  selected={selectedNote?.id === note.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: "1.5px solid",
                    borderColor:
                      selectedNote?.id === note.id
                        ? "primary.main"
                        : "grey.300",
                    bgcolor:
                      selectedNote?.id === note.id
                        ? "primary.light"
                        : "grey.100",
                    "&:hover": {
                      bgcolor: "primary.light",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    width="100%"
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography noWrap fontWeight="medium">
                        {note.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {note.date}
                      </Typography>
                    </Box>
                  </Stack>
                </ListItemButton>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2, px: 2 }}>
                No se encontraron actas.
              </Typography>
            )}
          </List>
        </Box>

        {/* Vista previa */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            ...neutralScrollbar,
          }}
        >
          <Typography variant="h6" gutterBottom>
            📋 Vista Previa
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              flexGrow: 1,
              p: 2,
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              bgcolor: "#fafafa",
              borderRadius: 2,
              ...neutralScrollbar,
            }}
          >
            {selectedNote
              ? selectedNote.content
              : "Selecciona una acta para ver su contenido."}
          </Paper>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
          >
            <Button
              onClick={() => setDialogOpen(true)}
              variant="outlined"
              color="error"
              size="small"
              disabled={!selectedNote}
            >
              Eliminar
            </Button>

            <Button
              onClick={handleDownload}
              variant="outlined"
              color="primary"
              size="small"
              disabled={!selectedNote}
            >
              Descargar Acta
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar la acta "{selectedNote?.title}"? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActaList;
