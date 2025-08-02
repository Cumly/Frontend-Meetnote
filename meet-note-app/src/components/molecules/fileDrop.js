import { Typography, Button, Paper } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileDrop = ({
  dragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  onButtonClick,
  allowedExtensions = ["txt", "mp4"], // valor por defecto
}) => {
  const extensionListText = allowedExtensions
    .map((ext) => `.${ext}`)
    .join(" o ");

  return (
    <Paper
      elevation={dragOver ? 10 : 3}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      sx={{
        border: dragOver ? "3px dashed #1976d2" : "2px dashed #ccc",
        borderRadius: 3,
        height: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: dragOver ? "#f8f7f7ff" : "#f7f4f4ff",
        textAlign: "center",
        transition: "all 0.3s ease",
        px: 2,
      }}
    >
      <UploadFileIcon sx={{ fontSize: 50, color: "#1976d2", mb: 1 }} />
      <Typography variant="body1">
        Arrastra tu archivo aquí para subirlo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        ({extensionListText})
      </Typography>
      <Button variant="contained" onClick={onButtonClick}>
        Elegir archivo
      </Button>
    </Paper>
  );
};

export default FileDrop;
