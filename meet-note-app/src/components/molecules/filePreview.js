import React from "react";
import { Paper, Typography, IconButton, Box, Stack } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const FilePreview = ({ file, onRemove }) => {
  if (!file) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 3,
        p: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        bgcolor: "#ffffffff",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} flex={1}>
        <InsertDriveFileIcon color="primary" fontSize="large" />
        <Box sx={{ overflow: "hidden" }}>
          <Typography
            variant="subtitle1"
            noWrap
            title={file.name}
            sx={{ maxWidth: 280 }}
          >
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {(file.size / 1024).toFixed(2)} KB
          </Typography>
        </Box>
      </Stack>
      <IconButton onClick={onRemove} size="small">
        <CloseIcon />
      </IconButton>
    </Paper>
  );
};

export default FilePreview;
