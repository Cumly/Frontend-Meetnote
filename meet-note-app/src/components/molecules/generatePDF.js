import React, { useRef } from "react";
import { Button, Box } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import html2pdf from "html2pdf.js";

const GeneratePDF = ({ textoHTML }) => {
  const contentRef = useRef(null);

  const generarPDF = () => {
    const opt = {
      margin: 10,
      filename: "acta-formal.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Creamos un elemento temporal para procesar el html y generar el pdf
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontSize = "14px";
    element.style.lineHeight = "1.6";
    element.style.maxWidth = "800px";
    element.style.margin = "0 auto";
    element.innerHTML = textoHTML;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box textAlign="center" mt={4}>
      <Button
        variant="contained"
        color="error"
        startIcon={<PictureAsPdfIcon />}
        onClick={generarPDF}
      >
        Descargar PDF
      </Button>
    </Box>
  );
};

export default GeneratePDF;
