import { Typography, Divider, Box } from "@mui/material";

const Preview = ({ contenido }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        👁️ Vista Previa
      </Typography>

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          padding: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          minHeight: "150px",
        }}
        dangerouslySetInnerHTML={{ __html: contenido }}
      />
      <Divider sx={{ my: 4 }} />
    </Box>
  );
};

export default Preview;
