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

const FormStep = ({ onGuardar, onBack, onCancel, initialData = {} }) => {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [participantesError, setParticipantesError] = useState(null);
  const [errors, setErrors] = useState({});

  const setData = () => {
    if (initialData) {
      setTitulo(initialData.titulo || "");
      setFecha(initialData.fecha || "");
      setHoraInicio(initialData.horaInicio || "");
      setHoraFin(initialData.horaFin || "");
      setParticipantes(initialData.participantes || []);
    }
  };

  useEffect(() => {
    setData();
  }, [initialData]);

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
    const ahora = new Date();

    const haceUnAno = new Date();
    haceUnAno.setFullYear(haceUnAno.getFullYear() - 1);

    if (titulo.trim() === "") {
      nuevosErrores.titulo = "El título es obligatorio.";
    }

    if (!fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    }

    if (!horaInicio) {
      nuevosErrores.horaInicio = "La hora de inicio es obligatoria";
    }

    if (!horaFin) {
      nuevosErrores.horaFin = "La hora de fin es obligatoria";
    }

    // Validación básica de fecha antes de usar horas
    if (fecha) {
      const fechaSeleccionada = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Eliminar hora para comparar solo fecha

      const fechaSinHora = new Date(fecha);
      fechaSinHora.setHours(0, 0, 0, 0);

      if (fechaSinHora > hoy) {
        nuevosErrores.fecha = "La fecha no puede estar en el futuro";
      }

      const haceUnAnoSinHora = new Date(haceUnAno);
      haceUnAnoSinHora.setHours(0, 0, 0, 0);

      if (fechaSinHora < haceUnAnoSinHora) {
        nuevosErrores.fecha =
          "La fecha no puede ser más antigua que hace un año";
      }
    }

    // Validación de horas solo si fecha está correcta
    if (
      fecha &&
      horaInicio &&
      horaFin &&
      !nuevosErrores.fecha &&
      !nuevosErrores.horaInicio &&
      !nuevosErrores.horaFin
    ) {
      const [hiHoras, hiMinutos] = horaInicio.split(":").map(Number);
      const [hfHoras, hfMinutos] = horaFin.split(":").map(Number);

      const [anio, mes, dia] = fecha.split("-").map(Number); // yyyy-mm-dd

      const fechaInicio = new Date(anio, mes - 1, dia, hiHoras, hiMinutos);
      const fechaFin = new Date(anio, mes - 1, dia, hfHoras, hfMinutos);

      if (fechaInicio > ahora) {
        nuevosErrores.horaInicio =
          "La hora de inicio no puede ser en el futuro.";
      }

      if (fechaFin > ahora) {
        nuevosErrores.horaFin = "La hora de fin no puede ser en el futuro.";
      }

      if (fechaFin <= fechaInicio) {
        nuevosErrores.horaFin =
          "La hora de fin no puede ser igual o anterior a la de inicio.";
      }
    }

    // Validar participantes: mínimo 2 y sin duplicados
    if (participantes.length < 2) {
      setParticipantesError("Debe haber al menos dos participantes.");
    } else {
      const nombres = participantes.map((p) => p.trim().toLowerCase());
      const tieneDuplicados = nombres.some(
        (nombre, idx) => nombres.indexOf(nombre) !== idx
      );

      if (tieneDuplicados) {
        setParticipantesError(
          "No se permiten nombres de participantes repetidos."
        );
      } else {
        setParticipantesError(null);
      }
    }

    setErrors(nuevosErrores);

    if (
      Object.keys(nuevosErrores).length === 0 &&
      participantes.length >= 2 &&
      !participantesError
    ) {
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
