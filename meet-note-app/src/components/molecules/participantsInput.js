// src/components/molecules/ParticipantsInput.js
import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const ParticipantsInput = ({
  participants = [],
  setParticipants,
  error,
  setError
}) => {
  const [nuevoParticipante, setNuevoParticipante] = useState("");

  const agregarParticipante = () => {
    const nombre = nuevoParticipante.trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!nombre) return;

    if (!regex.test(nombre)) {
      setError("Solo se permiten letras y espacios.");
      setNuevoParticipante("");
      return;
    }

    if (!participants.includes(nombre)) {
      setParticipants([...participants, nombre]);
      setNuevoParticipante("");
      setError(null);
    }
  };

  const eliminarParticipante = (index) => {
    const nuevos = participants.filter((_, i) => i !== index);
    setParticipants(nuevos);
    if (nuevos.length === 0) {
      setError("Debe agregar al menos un participante.");
    } else {
      setError(null);
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" mb={1}>
        Participantes
      </Typography>

      <Box display="flex" gap={1} alignItems="center">
        <TextField
          placeholder="Nombre del participante"
          value={nuevoParticipante}
          onChange={(e) => {
            setNuevoParticipante(e.target.value);
            if (error) setError(null);
          }}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <IconButton
          onClick={agregarParticipante}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            width: 35,
            height: 35,
            "&:hover": { bgcolor: "primary.dark" }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          maxHeight: 100,       // altura fija para la lista
          overflowY: "auto",    // scroll solo aquí
          mt: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          p: 1,
        }}
      >
        {participants.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            No hay participantes agregados.
          </Typography>
        ) : (
          participants.map((nombre, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.5}
              px={1}
            >
              <Typography>{nombre}</Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => eliminarParticipante(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ParticipantsInput;
