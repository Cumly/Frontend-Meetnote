import { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CustomInput from "../atoms/input";
import ParticipantsInput from "../molecules/participantsInput";
import ButtonStep from "../molecules/buttonsStep";

const style = {
  width: 600,
  maxWidth: "90vw",
  Height: 900,
  maxHeight: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 3,
  p: 4,
  display: "flex",
  flexDirection: "column",
  margin: "auto",
};

const FormStep = ({ onGuardar, onBack, onCancel }) => {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [participantesError, setParticipantesError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    setTitulo("");
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setParticipantes([]);
    setErrors({});
    setParticipantesError(null);
  };

  const handleCancelar = () => {
    resetForm();
    if (onCancel) onCancel(); // ejecuta el handler del componente padre
  };

  const handleAtras = () => {
    resetForm();
    if (onBack) onBack(); // ejecuta el handler del componente padre
  };

  const guardar = () => {
    const nuevosErrores = {};
    const hoy = new Date();
    const fechaReunion = new Date(fecha);

    if (titulo.trim() === "") {
      nuevosErrores.titulo = "El título es obligatorio.";
    }

    if (!fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else if (fechaReunion > hoy) {
      nuevosErrores.fecha = "La fecha no puede estar en el futuro";
    }

    if (!horaInicio) {
      nuevosErrores.horaInicio = "La hora de inicio es obligatoria";
    }

    if (!horaFin) {
      nuevosErrores.horaFin = "La hora de fin es obligatoria";
    } else if (horaInicio && horaFin < horaInicio) {
      nuevosErrores.horaFin =
        "La hora de fin no puede ser anterior a la de inicio.";
    }

    if (participantes.length === 0) {
      setParticipantesError("Debe agregar al menos un participante.");
    } else {
      setParticipantesError(null);
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0 && participantes.length > 0) {
      onGuardar({ titulo, fecha, horaInicio, horaFin, participantes });
    }
  };

  return (
    <Box sx={style}>
      <Typography variant="h4" align="center" mb={3} fontWeight="bold">
        Edita los detalles de la reunión ✍️
      </Typography>

      <Box sx={{ overflowY: "auto", flexGrow: 1, pr: 2, mb: 3 }}>
        <CustomInput
          label="Título de la reunión"
          value={titulo}
          onChange={(value) => {
            setTitulo(value);
            if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: null }));
          }}
          error={errors.titulo}
        />

        <CustomInput
          label="Fecha de la reunión"
          type="date"
          value={fecha}
          onChange={(value) => {
            setFecha(value);
            if (errors.fecha) setErrors((prev) => ({ ...prev, fecha: null }));
          }}
          error={errors.fecha}
          sx={{ mt: 2 }}
        />

        <Box display="flex" gap={2} mt={2}>
          <CustomInput
            label="Hora inicio"
            type="time"
            value={horaInicio}
            onChange={(value) => {
              setHoraInicio(value);
              if (errors.horaInicio)
                setErrors((prev) => ({ ...prev, horaInicio: null }));
            }}
            error={errors.horaInicio}
            sx={{ flex: 1 }}
          />

          <CustomInput
            label="Hora fin"
            type="time"
            value={horaFin}
            onChange={(value) => {
              setHoraFin(value);
              if (errors.horaFin)
                setErrors((prev) => ({ ...prev, horaFin: null }));
            }}
            error={errors.horaFin}
            sx={{ flex: 1 }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <ParticipantsInput
          participants={participantes}
          setParticipants={setParticipantes}
          error={participantesError}
          setError={setParticipantesError}
        />
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          pt: 2,
          pb: 1,
          borderTop: "1px solid #eee",
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          zIndex: 10,
        }}
      >
        <ButtonStep
          onBack={handleAtras}
          onCancel={handleCancelar}
          onContinue={guardar}
        />
      </Box>
    </Box>
  );
};

export default FormStep;
