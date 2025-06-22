import Button from "./Button";
import "./Header.css";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";
import { useNavigate, useLocation } from "react-router-dom";
import { Project } from "../../types/types";
import { useEffect, useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/full-name", {
          credentials: "include",
        });
        const userData = await res.json();
        if (res.ok && userData.fullName) {
          setFullName(userData.fullName);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user-projects", {
          credentials: "include",
        });
        const projectData = await res.json();
        if (res.ok) {
          setProjects(projectData.projects);

          const state = location.state as { newProjectId?: string };

          if (state?.newProjectId) {
            setSelectedProjectId(state.newProjectId);
            navigate(location.pathname, { replace: true, state: {} });
          } else if (projectData.projects.length > 0) {
            setSelectedProjectId(projectData.projects[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchUser();
    fetchProjects();
  }, []);

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const userInitials = getInitials(fullName || "U");

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSettings = () => {
    // navigate to settings page
    navigate("/settings");
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    // logout logic
    console.log("Logging out...");
    const res = await fetch(`http://localhost:3000/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.logout) {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const currentProject = projects.find((p) => p._id === selectedProjectId);
  const toggleProject = () => {
    setProjectOpen((prev) => !prev);
  };

  const createProject = () => {
    navigate("/setup", {
      state: { mode: "createProject" },
    });
    setProjectOpen(false);
  };

  const swapProject = (projectIdToMove: string) => {
    setSelectedProjectId(projectIdToMove);
    navigate("/inbox", { state: { selectedProjectId: projectIdToMove } });
    setProjectOpen(false);
  };

  return (
    <>
      <section className="header-container">
        <TapioLogoDesktop className="logo" />
        <div className="tgl-btn-container">
          <Button
            className={`tgl-btn inbox-tgl-btn ${
              location.pathname === "/inbox" ? "active" : ""
            }`}
            onClick={() => navigate("/inbox", { state: { selectedProjectId } })}
            buttonText="Inbox"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${
              location.pathname === "/board" ? "active" : ""
            }`}
            onClick={() => navigate("/board", { state: { selectedProjectId } })}
            buttonText="Board"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${
              location.pathname === "/filter" ? "active" : ""
            }`}
            onClick={() => navigate("/filter", { state:  {selectedProjectId} })}
            buttonText="Filter"
          />
        </div>
        <div className="project">
          <button onClick={toggleProject}>{currentProject?.name}</button>
          {projectsOpen && (
            <div className="dropdown">
              {projects.map((pro) => {
                return (
                  <button key={pro._id} onClick={() => swapProject(pro._id)}>
                    {pro.name}
                  </button>
                );
              })}
              <button onClick={createProject}>New Project +</button>
            </div>
          )}
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
  );
};
export default Header;
