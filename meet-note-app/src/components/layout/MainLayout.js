// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileAvatar from "../components/molecules/ProfileAvatar";
import { logoutGoogle } from "../services/googleApi";

const MainLayout = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // ocupa toda la pantalla
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        {user && (
          <ProfileAvatar userPhoto={user?.photo} onLogout={handleLogout} />
        )}
      </header>

      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
