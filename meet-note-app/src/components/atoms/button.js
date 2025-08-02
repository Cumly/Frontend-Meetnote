import { Button as MuiButton } from "@mui/material";

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "contained",
  color = "primary",
  style = {},
}) => {
  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      color={color}
      style={style}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
