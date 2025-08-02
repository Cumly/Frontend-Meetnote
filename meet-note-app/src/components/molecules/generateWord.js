import React from "react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const GenerateWord = ({ textoPlano }) => {
  const generarWord = () => {
    const doc = new Document();

    const lines = textoPlano.split("\n");
    const children = [];

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        children.push(new Paragraph({ text: "" }));
        return;
      }

      if (/^\*\*(.+)\*\*$/.test(trimmed)) {
        const texto = trimmed.replace(/\*\*/g, "");
        children.push(
          new Paragraph({
            text: texto,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          })
        );
        return;
      }

      const keyValMatch = trimmed.match(/^\*\*(.+):\*\*\s*(.+)$/);
      if (keyValMatch) {
        const key = keyValMatch[1];
        const val = keyValMatch[2];
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: key + ": ", bold: true }),
              new TextRun(val),
            ],
            spacing: { after: 150 },
          })
        );
        return;
      }

      if (/^\*\s+/.test(trimmed)) {
        const texto = trimmed.replace(/^\*\s+/, "");
        children.push(
          new Paragraph({
            text: texto,
            bullet: { level: 0 },
            spacing: { after: 100 },
          })
        );
        return;
      }

      children.push(
        new Paragraph({
          text: trimmed,
          spacing: { after: 150 },
        })
      );
    });

    doc.addSection({ children });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "acta_generada.docx");
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={generarWord}
      sx={{ mt: 2, px: 4, py: 1.5, fontWeight: "bold", fontSize: "1rem" }}
    >
      Descargar Acta Word
    </Button>
  );
};

export default GenerateWord;
