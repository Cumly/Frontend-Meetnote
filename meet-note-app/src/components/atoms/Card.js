import React from "react";
import { Card, CardContent } from "@mui/material";

const CustomCard = ({ sx, children, onClick = () => {} }) => {
  return (
    <Card sx={sx} onClick={onClick}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CustomCard;
