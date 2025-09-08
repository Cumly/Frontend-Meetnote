import { TextField } from "@mui/material";

const CustomInput = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  inputProps,
}) => {
  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={Boolean(error)}
      helperText={error}
      margin="normal"
      InputLabelProps={
        type === "date" || type === "time" ? { shrink: true } : {}
      }
      inputProps={inputProps} // <-- aquí pasamos min/max u otros props nativos
    />
  );
};

export default CustomInput;
