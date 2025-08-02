import { IconButton, Tooltip, Avatar } from "@mui/material";

const IconAvatar = ({ photo, onClick }) => {
  return (
    <Tooltip title="Perfil de usuario">
      <IconButton
        color="inherit"
        aria-label="perfil"
        onClick={onClick}
        size="large"
      >
        <Avatar alt="User" src={photo} sx={{ width: 32, height: 32 }} />
      </IconButton>
    </Tooltip>
  );
};

export default IconAvatar;
