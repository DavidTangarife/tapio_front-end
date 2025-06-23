
import Button from "./Button";
import "./Header.css";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";
import { useNavigate, useLocation } from "react-router-dom";
import { Project } from "../../types/types";
import { useEffect, useState } from "react";
import { KeyboardArrowDown, Logout, Add } from '@mui/icons-material';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  //const { projectId } = useParams();

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
          setCurrentProject((prev) => prev || projectData.projects[0]._id)
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchUser();
    fetchProjects();
  }, []);

  
  const maxCharsProjectName = (name: string, maxChars: number = 16) => {
    if (name.length <= maxChars) return name;
    return name.substring(0, maxChars) + "...";
  };

  const handleLogout = async () => {
    // logout logic
    console.log("Logging out...");
    const res = await fetch(`http://localhost:3000/api/users/logout`, {
      method: 'POST',
      credentials: "include"
    })
    const data = await res.json()
    if (data.logout) {
      navigate('/')
    }
    setMenuOpen(false);
  };

  const showCurrentProject = projects.find((p) => p._id === currentProject);
  const toggleProject = () => {
    setProjectOpen((prev) => !prev);
  };

  const createProject = () => {
    navigate("/setup", {
      state: { mode: "createProject" },
    });
    setProjectOpen(false);
  };

  const swapProject = (projecIdtomove: string) => {
    setCurrentProject(projecIdtomove);
    navigate(`/inbox`);
    setProjectOpen(false);
  };

  return (
    <>
      <section className="header-container">
        <TapioLogoDesktop className="logo" />
        <div className="tgl-btn-container">
          <Button
            className={`tgl-btn inbox-tgl-btn ${location.pathname === "/inbox"
              ? "active"
              : ""
              }`}
            onClick={() => navigate(`/inbox`)}
            buttonText="Inbox"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${location.pathname === "/kanban"
              ? "active"
              : ""
              }`}
            onClick={() => navigate(`/board`)}
            buttonText="Board"
          />
          <Button
            className={`tgl-btn board-tgl-btn ${location.pathname === "/filter"
              ? "active"
              : ""
              }`}
            onClick={() => navigate(`/filter`)}
            buttonText="Filter"
          />
        </div>
        <div className="project">
          <button 
            onClick={toggleProject}
            className="current-project-title">
             {showCurrentProject ? maxCharsProjectName(showCurrentProject?.name) : "Select a Project"}
            <KeyboardArrowDown />
            </button>
          {projectOpen && (
            <div className="dropdown">
              <h3 className="my-projects-title">Projects</h3>
              {projects.map((pro) => {
                return (
                  <button key={pro._id} 
                    onClick={() => swapProject(pro._id)}
                    className="project-btns">
                    {pro.name}
                  </button>
                
                );
              })}
              <button onClick={createProject}
                      className="add-project-btn"><Add sx={{color: "var(--color-green-dark-mode)"}}/>Add New Project</button>
              
              <button onClick={handleLogout}
                      className="logout-btn"><Logout sx={{color: "var(--color-green-dark-mode)"}} />Logout</button>
            </div>
          )}
        </div>
        {/* <div className="user-menu">
          <button className="user-btn" onClick={toggleMenu}>
            {userInitials}
          </button>
          {menuOpen && (
            <div className="dropdown">
              <button onClick={handleSettings}>Settings</button>
              
            </div>
          )}
        </div> */}
      </section>
    </>
  );
};
export default Header;
