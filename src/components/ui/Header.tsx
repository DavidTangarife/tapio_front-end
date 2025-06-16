import Button from "./Button";
import "./Header.css";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {projectId} = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/full-name", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.fullName) {
          setFullName(data.fullName);
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }

  const userInitials = getInitials(fullName || "U");

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleSettings = () => {
    // navigate to settings page
    navigate("/settings");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    // logout logic
    console.log("Logging out...");
    setMenuOpen(false);
  };

return (
  <>
    <section className="header-container">
      <TapioLogoDesktop className="logo" />
      <div className="tgl-btn-container">
        <Button 
          className={`tgl-btn inbox-tgl-btn ${location.pathname === `/projects/${projectId}/emails` ? "active" : ""}`}
          onClick={() => navigate(`/projects/${projectId}/emails`)}
          buttonText="Inbox"
        />
        <Button
          className={`tgl-btn board-tgl-btn ${location.pathname === `/kanban/${projectId}` ? "active" : ""}`}
          onClick={() => navigate(`/kanban/${projectId}`)}
          buttonText="Board"
        />
        <Button
          className={`tgl-btn filter-tgl-btn ${location.pathname === `/filter/${projectId}` ? "active" : ""}`}
          onClick={() => navigate(`/filter/${projectId}`)}
          buttonText="Filter"
        />
      </div>
      <div className="user-menu">
        <button className="user-btn" onClick={toggleMenu}>
          {userInitials}
        </button>
        {menuOpen && (
          <div className="dropdown">
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </section>
  </>
)
}
export default Header;