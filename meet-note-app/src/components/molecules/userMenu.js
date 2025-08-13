import { Avatar, Menu, MenuItem } from "@mui/material";

const UserMenu = ({ anchorEl, open, onClose, handleLogout, photo }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      elevation={2}
    >
      <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
    </Menu>
  );
};

export default UserMenu;
