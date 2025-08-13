import React from "react";
import { Box, Typography, Divider, Stack, Button } from "@mui/material";
import GeneratePDF from "../molecules/generatePDF";

const ExportActa = ({ texto, handleBack, handleHome, titulo }) => {
  return (
    <Box sx={{ minHeight: 200, display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          maxWidth: 600,
          width: 500,
          mx: "auto",
          mt: 6,
          p: 4,
          bgcolor: "#ffffffff",
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 5,
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1976d2" }}
        >
          📄 Exportar Acta Generada
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
        >
          El acta ha sido generada correctamente. Puedes exportarla como PDF
        </Typography>

        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <GeneratePDF textoHTML={texto} titulo={titulo} />
        </Stack>

        <Divider sx={{ mt: 4, mb: 3 }} />

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            onClick={handleBack}
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            Atrás
          </Button>
          <Button
            onClick={handleHome}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            Volver al menú principal
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ExportActa;
