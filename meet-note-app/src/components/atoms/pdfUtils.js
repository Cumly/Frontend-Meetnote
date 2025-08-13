import html2pdf from "html2pdf.js";

export const generatePDFBlob = (text) => {
  return new Promise((resolve, reject) => {
    const opt = {
      margin: 10,
      filename: "acta-formal.pdf", // solo referencia, no usado para Blob
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Crear un elemento div
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontSize = "14px";
    element.style.lineHeight = "1.6";
    element.style.maxWidth = "800px";
    element.style.margin = "0 auto";

    // Convertir texto plano a HTML básico con preservación de saltos de línea
    // Escapa caracteres especiales y reemplaza saltos de línea por <br>
    const escapeHtml = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const htmlContent = escapeHtml(text).replace(/\n/g, "<br>");

    element.innerHTML = htmlContent;

    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob")
      .then(resolve)
      .catch(reject);
  });
};
