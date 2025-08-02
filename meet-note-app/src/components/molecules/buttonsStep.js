import { Box } from "@mui/material";
import Button from "../atoms/button";

const ButtonStep = ({
  onBack,
  onCancel,
  onContinue,
  disabled,
  continueLabel = "Continuar",
  hideContinue = false,
  hideBack = false,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
      {!hideBack && (
        <Button
          onClick={onBack}
          disabled={disabled}
          variant="outlined"
          color="primary"
        >
          Atrás
        </Button>
      )}

      <Button
        onClick={onCancel}
        disabled={disabled}
        variant="outlined"
        color="error"
      >
        Cancelar
      </Button>

      {!hideContinue && (
        <Button
          onClick={onContinue}
          disabled={disabled}
          variant="contained"
          color="primary"
        >
          {continueLabel}
        </Button>
      )}
    </Box>
  );
};

export default ButtonStep;
