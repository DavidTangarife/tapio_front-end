import Button from "./Button";
import "./Header.css";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";
import { useNavigate } from "react-router-dom";
import { Project } from "../../types/types";
import { useEffect, useState } from "react";

const Header = ({ onProjectSwap }: { onProjectSwap: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>();
  const navigate = useNavigate();

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
  const toggleProject = () => {
    setProjectOpen((prev) => !prev);
  };

  const createProject = () => {
    navigate("/setup", {
      state: { mode: "createProject" },
    });
    setProjectOpen(false);
  };

  const swapProject = async (projecIdtomove: string) => {
    try {
      const res = await fetch("http://localhost:3000/api/session-update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId: projecIdtomove }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        const currentPro = projects.find((p) => p._id === data.projectId);
        console.log(currentPro?.name);
        setCurrentProject(currentPro);
        onProjectSwap();
      } else {
        throw new Error("Failed to update session!");
      }
      setProjectOpen(false);
    } catch (err) {
      console.error("Error updating session project:", err);
    }
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
            onClick={() => navigate("/inbox")}
            buttonText="Inbox"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${
              location.pathname === "/board" ? "active" : ""
            }`}
            onClick={() => navigate("/board")}
            buttonText="Board"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${
              location.pathname === "/filter" ? "active" : ""
            }`}
            onClick={() => navigate("/filter")}
            buttonText="Filter"
          />
        </div>
        <div className="project">
          <button onClick={toggleProject}>{currentProject?.name || projects[0]?.name}</button> //Deal with this when brain is Ok
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
