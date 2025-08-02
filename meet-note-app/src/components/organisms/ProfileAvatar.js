// src/components/molecules/ProfileAvatar.jsx
import { useState } from "react";
import IconAvatar from "../atoms/iconAvatar";
import UserMenu from "../molecules/userMenu";

const ProfileAvatar = ({ userPhoto, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  return (
    <>
      <IconAvatar photo={userPhoto} onClick={handleClick} />
      <UserMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onLogout={handleLogout}
        photo={userPhoto}
      />
    </>
  );
};

export default ProfileAvatar;
