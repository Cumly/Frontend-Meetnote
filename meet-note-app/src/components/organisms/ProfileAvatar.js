import { useState, useEffect } from "react";
import IconAvatar from "../atoms/iconAvatar";
import UserMenu from "../molecules/userMenu";
import { useNavigate } from "react-router-dom";
import {
  logoutGoogle,
  loginGoogle,
  getUserBasicInfo,
} from "../../services/googleService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
} from "@mui/material";

const ProfileAvatar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [user, setUser] = useState({ name: "", photo: "" });
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  useEffect(() => {
    getUserBasicInfo()
      .then((data) => {
        console.log("Datos usuario completos:", JSON.stringify(data, null, 2));
        if (data.name) {
          // Separar en palabras y quitar las que tengan comillas
          const parts = data.name
            .trim()
            .split(" ")
            .filter(
              (word) =>
                !word.includes('"') &&
                !word.includes("“") &&
                !word.includes("”")
            );

          if (parts.length === 0) {
            setUser({ name: "", photo: data.photo || "" });
            return;
          }

          const lastName = parts.slice(0, -1).join(" ");
          const firstName = parts[parts.length - 1];
          const formattedName = `${firstName} ${lastName}`.trim();

          setUser({
            name: formattedName,
            photo: data.photo || "",
          });
        } else {
          setUser({
            name: data.name || "",
            photo: data.photo || "",
          });
        }
      })
      .catch((err) => console.error("Error cargando info de usuario:", err));
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setConfirmOpen(true);
    handleClose();
  };

  const handleConfirmLogout = async () => {
    setConfirmOpen(false);
    try {
      await logoutGoogle();
      navigate(loginGoogle());
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCancelLogout = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Typography sx={{ ml: 1, fontWeight: "medium", color: "text.primary" }}>
          {user.name}
        </Typography>
        <IconAvatar photo={user.photo} />
      </Box>

      <UserMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        handleLogout={handleLogoutClick}
        photo={user.photo}
      />

      <Dialog open={confirmOpen} onClose={handleCancelLogout}>
        <DialogTitle>¿Cerrar sesión?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas cerrar sesión? Se perderán los datos no
            guardados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            variant="contained"
          >
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileAvatar;
