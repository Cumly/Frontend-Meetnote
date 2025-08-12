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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import GeneratePDF from "./generatePDF";

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

const StepperForm = ({ children, activeStep, setActiveStep, texto }) => {
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
          <Box
            sx={{
              maxWidth: 500,
              mx: "auto",
              mt: 6,
              p: 4,
              bgcolor: "#f5f5f5",
              borderRadius: 3,
              boxShadow: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Exportar Acta Generada
            </Typography>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mt: 3 }}
            >
              <GeneratePDF textoHTML={texto} />
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                onClick={handleBack}
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                Atrás
              </Button>
              <Button
                onClick={handleHome}
                variant="contained"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                Volver al menú principal
              </Button>
            </Stack>
          </Box>
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
      <Dialog open={confirmOpen} onClose={handleConfirmNo}>
        <DialogTitle>¿Cancelar y salir al menú principal?</DialogTitle>
        <DialogContent>
          <Typography>
            Se perderán los datos no guardados. ¿Desea continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmYes} color="error" variant="contained">
            Sí, salir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepperForm;
