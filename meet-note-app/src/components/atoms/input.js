import { TextField } from "@mui/material";

const CustomInput = ({ label, value, onChange, error, type = "text" }) => {
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
      InputLabelProps={type === "date" || type === "time" ? { shrink: true } : {}}
    />
  );
};

export default CustomInput;