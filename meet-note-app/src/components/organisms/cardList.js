// src/components/organisms/CardList.js
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import InfoCard from "../molecules/infoCard";
import { useNavigate } from "react-router-dom"; // 👈 importar

const CardList = ({ cardsData }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const navigate = useNavigate(); // 👈 usar hook para redirección

  const handleCardClick = (id, route) => {
    setSelectedCardId(id);
    if (route) {
      navigate(route); // 👈 redirige a la ruta especificada
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Elige tu método de creación del acta. ✏️
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 2,
        }}
      >
        {cardsData.map((card) => (
          <InfoCard
            key={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            selected={selectedCardId === card.id}
            onClick={() => handleCardClick(card.id, card.route)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CardList;
