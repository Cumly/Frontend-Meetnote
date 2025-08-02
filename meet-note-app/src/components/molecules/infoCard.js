import React from "react";
import { Box, Typography } from "@mui/material";
import CustomCard from "../atoms/Card";

const InfoCard = ({ title, description, onClick, selected, icon }) => {
  const style = {
    width: 250,
    height: 250, // Fijamos altura para centrar verticalmente
    margin: 2,
    cursor: "pointer",
    boxShadow: selected ? 3 : 1,
    transform: selected ? "scale(1.05)" : "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centrado vertical
    textAlign: "center",
    "&:hover": {
      transform: "scale(1.05)",
    },
  };

  return (
    <CustomCard onClick={onClick} sx={style}>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 60 }}>{icon}</Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CustomCard>
  );
};

export default InfoCard;
