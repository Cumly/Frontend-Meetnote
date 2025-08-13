import React, { useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import html2pdf from "html2pdf.js";
import { subirArchivoDrive } from "../../services/googleService";

const GeneratePDF = ({ textoHTML, titulo = "sin-titulo" }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" o "error"

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const generarYDescargarYSubirPDF = async () => {
    try {
      const fecha = new Date();

      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, "0");
      const dd = String(fecha.getDate()).padStart(2, "0");
      console.log("Fecha local:", fecha.toString());
      console.log("Fecha UTC:", fecha.toISOString());

      const fechaStr = `${yyyy}${mm}${dd}`;
      const nombreArchivo = `Acta_${fechaStr}_${titulo.replace(
        /\s+/g,
        "_"
      )}.pdf`;

      const opt = {
        margin: 10,
        filename: nombreArchivo,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.fontSize = "14px";
      element.style.lineHeight = "1.6";
      element.style.maxWidth = "800px";
      element.style.margin = "0 auto";
      element.innerHTML = textoHTML;

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");

      // Descargar localmente creando un enlace temporal
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Crear archivo para subir a Drive
      const file = new File([pdfBlob], nombreArchivo, {
        type: "application/pdf",
      });

      await subirArchivoDrive(file);

      setSnackbarMsg("PDF subido a Drive correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al generar, descargar o subir PDF:", error);
      setSnackbarMsg("Error al procesar el PDF");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Button
        variant="contained"
        color="error"
        startIcon={<PictureAsPdfIcon />}
        onClick={generarYDescargarYSubirPDF}
      >
        Guardar PDF local y en Drive
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneratePDF;
