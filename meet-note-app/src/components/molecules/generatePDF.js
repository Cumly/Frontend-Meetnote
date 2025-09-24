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

      const fechaStr = `${yyyy}${mm}${dd}`;

      // 🔹 Sanitizar el título
      const tituloSeguro = (titulo || "sin_titulo")
        .replace(/[<>:"/\\|?*]+/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 100);

      const nombreArchivo = `Acta_${fechaStr}_${tituloSeguro}.pdf`;

      const opt = {
        margin: 10,
        filename: nombreArchivo,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // 🔹 Estilos
      const contenidoConSaltos = `
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; }

    ul, ol, p, table {
      page-break-inside: avoid; 
      break-inside: avoid; 
    }

    h1, h2, h3, h4 {
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: avoid;
    }

    .pdf-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 10px;
      color: #555;
      text-align: center;
      border-top: 1px solid #ccc;
      padding-top: 4px;
    }
  </style>

  <div>
    ${textoHTML}
  </div>

  <div class="pdf-footer">
    Acta generada automáticamente - ${new Date().toLocaleDateString()}
  </div>
`;

      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.fontSize = "14px";
      element.style.lineHeight = "1.6";
      element.style.maxWidth = "800px";
      element.style.margin = "0 auto";

      element.innerHTML = contenidoConSaltos;

      // 🔹 Generar PDF como objeto jsPDF
      const pdf = await html2pdf().set(opt).from(element).toPdf().get("pdf");

      // 🔹 Insertar paginación
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() - 5,
          { align: "center" }
        );
      }

      // 🔹 Exportar como Blob
      const pdfBlob = pdf.output("blob");

      // Descargar localmente
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Subir a Drive
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
        Guardar PDF
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
