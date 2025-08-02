import { useState } from "react";
import TextEditor from "../atoms/textEditor";
import { Typography, Divider, Box, Button, Alert } from "@mui/material";
import CustomCard from "../atoms/Card";
import ButtonStep from "../molecules/buttonsStep";

const EditStep = ({ data, onBack, onCancel, onGuardar }) => {
  const [contenido, setContenido] = useState(data || "");
  const [error, setError] = useState(null);

  const handleContinue = () => {
    // Validar que contenido no esté vacío (quitando etiquetas HTML)
    const textoPlano = contenido.replace(/<[^>]+>/g, "").trim();

    if (!textoPlano) {
      setError("El contenido no puede estar vacío.");
      return;
    }

    setError(null);
    // Pasar contenido a padre
    if (onGuardar) onGuardar(contenido);
  };

  return (
    <CustomCard
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        px: 4,
        py: 5,
        boxShadow: 4,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          ✍️ Edita el Acta Generada
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Usa el editor para modificar el contenido del acta. Puedes ver los
          cambios en la vista previa.
        </Typography>

        <TextEditor data={contenido} onChange={setContenido} />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Aquí puedes poner la vista previa si quieres */}

        <ButtonStep
          onBack={onBack}
          onCancel={onCancel}
          onContinue={handleContinue}
        />
      </Box>
    </CustomCard>
  );
};

export default EditStep;
