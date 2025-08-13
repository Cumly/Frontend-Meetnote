import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import GeneratePDF from "./generatePDF";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ExportActa from "../organisms/exportActa";

const StepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color:
    ownerState.active || ownerState.completed
      ? theme.palette.primary.main
      : "#B0BEC5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
}));

const CustomStepIcon = (props) => {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        <CheckCircleIcon fontSize="inherit" />
      ) : (
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: active ? "primary.main" : "#B0BEC5",
          }}
        />
      )}
    </StepIconRoot>
  );
};

const StepperForm = ({
  children,
  activeStep,
  setActiveStep,
  texto,
  titulo,
}) => {
  const steps = React.Children.toArray(children);
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleReset = () => setActiveStep(0);
  // Mostrar diálogo de confirmación para volver al menú principal

  const handleHome = () => {
    setConfirmOpen(true);
  };
  const handleConfirmYes = () => {
    setConfirmOpen(false);
    setActiveStep(0);
    navigate("/");
  };

  const handleConfirmNo = () => {
    setConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        textAlign: "center",
        px: 5,
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 5,
          "& .MuiStepLabel-label": {
            fontSize: "1rem",
            fontWeight: 500,
          },
        }}
      >
        {steps.map((_, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              Paso {index + 1}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 200 }}>
        {activeStep === steps.length ? (
          <ExportActa
            texto={texto}
            handleBack={handleBack}
            handleHome={handleHome}
            titulo={titulo}
          ></ExportActa>
        ) : (
          <>
            {React.cloneElement(steps[activeStep], {
              onNext: handleNext,
              onBack: handleBack,
              onReset: handleReset,
            })}
          </>
        )}
      </Box>
      {/* Diálogo de confirmación */}
      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={handleConfirmNo}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: "bold",
            color: "warning.main",
          }}
        >
          <WarningAmberIcon color="warning" />
          ¿Deseas salir al menú principal?
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Se perderán los datos no guardados.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleConfirmNo}
            sx={{
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmYes}
            variant="contained"
            color="error"
            sx={{
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepperForm;
