import CardList from "../components/organisms/cardList";
import { useState } from "react";

const HomePage = () => {
  const cardsData = [
    {
      id: 1,
      title: "Grabar Reunión",
      description: "Captura audio en tiempo real.",
      icon: "🎙️",
      route: "actas/grabar-audio",
    },
    {
      id: 2,
      title: "Subir Transcripción",
      description: "Carga el texto de la reunión.",
      icon: "📋",
      route: "actas/subir-transcripcion",
    },
    {
      id: 3,
      title: "Subir Video",
      description: "Carga la grabación de la reunión.",
      icon: "📽️",
      route: "actas/subir-grabacion",
    },
    {
      id: 4,
      title: "Ver Reunión",
      description: "Accede a reuniones previas.",
      icon: "🗓️",
      route: "actas/obtener-reunion",
    },
  ];

  return <CardList cardsData={cardsData}></CardList>;
};

export default HomePage;
