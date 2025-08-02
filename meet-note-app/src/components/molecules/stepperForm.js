import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

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

const StepperForm = ({ children, activeStep, setActiveStep }) => {
  const steps = React.Children.toArray(children);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleReset = () => setActiveStep(0);

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
          <Box textAlign="center">
            <Typography variant="h5" color="success.main" mb={3}>
              ¡Todos los pasos completados!
            </Typography>
            <Button
              onClick={handleReset}
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              Reiniciar
            </Button>
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
    </Box>
  );
};

export default StepperForm;
