import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import GenerateWord from "../molecules/generateWord";
import GeneratePDF from "../molecules/generatePDF";

const ExportActa = ({ textoPlano }) => {
  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: "#f5f5f5",
        borderRadius: 3,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Exportar Acta Generada
      </Typography>

      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 3 }}>
        <GeneratePDF textoHTML={textoPlano} />
      </Stack>
    </Box>
  );
};

export default ExportActa;
