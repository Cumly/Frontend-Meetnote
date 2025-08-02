import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ButtonStep from "../molecules/buttonsStep";

const MeetStep = ({ authenticated, onLogin, meetingsData, loading }) => {
  const [platform, setPlatform] = useState(null);
  const [meetingId, setMeetingId] = useState("");

  const handlePlatformChange = (_, newPlatform) => {
    setPlatform(newPlatform);
    setMeetingId("");
  };

  const meetings = platform ? meetingsData?.[platform] || [] : [];

  return (
    <Box
      sx={{
        maxWidth: 620,
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Accede a las reuniones
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Elige la <b>plataforma</b> donde realizaste la reunión
      </Typography>

      <ToggleButtonGroup
        value={platform}
        exclusive
        onChange={handlePlatformChange}
        sx={{
          gap: 2,
          "& .MuiToggleButton-root": {
            px: 4,
            py: 1.6,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            border: "1px solid #ccc",
            color: "#333",
            background: "#fafafa",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "primary.main",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            },
          },
          "& .MuiToggleButton-root.Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 5px 15px rgba(25,118,210,0.4)",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          },
        }}
      >
        <ToggleButton value="teams">Teams</ToggleButton>
        <ToggleButton value="zoom">Zoom</ToggleButton>
        <ToggleButton value="google">Google Meet</ToggleButton>
      </ToggleButtonGroup>

      {platform && (
        <Box sx={{ width: "100%", mt: 4 }}>
          {!authenticated ? (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              fullWidth
              onClick={() => onLogin(platform)}
              sx={{
                px: 5,
                py: 1.7,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 3,
                textTransform: "none",
                background: "linear-gradient(to right, #42a5f5, #1e88e5)",
                boxShadow: "0 6px 16px rgba(33, 150, 243, 0.4)",
                "&:hover": {
                  background: "linear-gradient(to right, #1e88e5, #1565c0)",
                  boxShadow: "0 8px 24px rgba(21, 101, 192, 0.5)",
                },
              }}
            >
              Iniciar sesión en {platform}
            </Button>
          ) : loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel id="meeting-select-label">
                  Selecciona la reunión
                </InputLabel>
                <Select
                  labelId="meeting-select-label"
                  value={meetingId}
                  label="Selecciona la reunión"
                  onChange={(e) => setMeetingId(e.target.value)}
                  IconComponent={MeetingRoomIcon}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  {meetings.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {meetings.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, fontStyle: "italic" }}
                >
                  No se encontraron reuniones grabadas o con transcripción.
                </Typography>
              )}
            </>
          )}
        </Box>
      )}
      <Box
        sx={{
          mt: 4,
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ButtonStep
          hideBack={true}
          onBack={() => console.log("")}
          onCancel={() => console.log("")}
          onContinue={() => console.log("")}
        />
      </Box>
    </Box>
  );
};

export default MeetStep;
