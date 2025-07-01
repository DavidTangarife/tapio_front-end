import Button from "./Button";
import "./Header.css";
import TapioLogoDesktop from "../../assets/tapio-desktop-logo.svg?react";
import { useNavigate, useLocation } from "react-router-dom";
import { Project } from "../../types/types";
import { useEffect, useState } from "react";
import {
  KeyboardArrowDown,
  Logout,
  Add,
  DeleteOutlined,
} from "@mui/icons-material";

const Header = ({ onProjectSwap }: { onProjectSwap: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user-projects", {
          credentials: "include",
        });
        const projectData = await res.json();
        if (res.ok) {
          // The issue is that we were trying to work from a Patch or function that only works when clickin on the dropdown, when it should be setup on the use effect and just a get project ID
          setProjects(projectData.projects);
          const current_res = await fetch(
            "http://localhost:3000/api/session-project",
            {
              credentials: "include",
            }
          );
          const current_data = await current_res.json();
          const currentProject = projectData.projects.find(
            (p: Project) => p._id === current_data.projectId
          );
          if (currentProject) {
            setCurrentProjectId(currentProject._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
      setLoadingProject(false);
    };
    fetchProjects();
  }, []);

  const maxCharsProjectName = (name: string | undefined, maxChars: number = 16) => {
    if (!name) return "Select Project"
    if (name.length <= maxChars) return name;
    return name.substring(0, maxChars) + "...";
  };

  const handleLogout = async () => {
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
        setCurrentProjectId(projecIdtomove);
        onProjectSwap();
      } else {
        throw new Error("Failed to update session!");
      }
      setProjectOpen(false);
    } catch (err) {
      console.error("Error updating session project:", err);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "DELETE",
        headers: { "Content-Type" : "application/json"},
        credentials: "include",
        body: JSON.stringify({ projectId: projectToDelete }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete project");
      }
      // Change the current project in the menu after deleting one. 
      const currentIndex = projects.findIndex(p => p._id === currentProject?._id);
      const nextIndex = (currentIndex + 1) % projects.length;
      const nextProject = projects[nextIndex]
      // Remove the deleted project from the state
      setProjects(prevProjects => prevProjects.filter(p => p._id !== projectToDelete?._id));
      setOpenDeleteModal(false);
      setProjectToDelete(null);
      //switch to the next available project.
      swapProject(nextProject._id);
    } catch (err) {
      console.error("Failed to delete project.")
    }
  }

  const currentProject = projects.find((p) => p._id === currentProjectId);

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
          <button onClick={toggleProject} className="current-project-title">
            {loadingProject
              ? "Loading..."
              : maxCharsProjectName(currentProject?.name)}
            <KeyboardArrowDown />
          </button>
          {projectsOpen && (
            <div className="dropdown">
              <h3 className="my-projects-title">Projects</h3>
              {projects.map((pro) => {
                return (
                  <div className="project-btn-delete-container">
                    <button
                      key={pro._id}
                      onClick={() => swapProject(pro._id)}
                      className="project-btns"
                    >
                      {pro.name}
                    </button>
                    <DeleteOutlined
                      className="project-delete-icon"
                      onClick={() => {
                        setProjectToDelete(pro);
                        setOpenDeleteModal(true);
                      }}
                    />
                  </div>
                );
              })}
              <button onClick={createProject} className="add-project-btn">
                <Add sx={{ color: "var(--color-green-dark-mode)" }} />
                Add New Project
              </button>

              <button onClick={handleLogout} className="logout-btn">
                <Logout sx={{ color: "var(--color-green-dark-mode)" }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* pop up to confirm delete project */}
      {openDeleteModal && (
        <>
          <div className="delete-modal-overlay"></div>
          <aside className="confirm-delete-modal">
            <p className="confirm-delete-msg">
              Are you sure you want to delete:
            </p>
            <p className="project-to-delete">{projectToDelete?.name}?</p>
            <div className="delete-modal-btn-container">
              <button className="delete-modal-btn yes" onClick={handleDeleteProject}>Yes</button>
              <button
                className="delete-modal-btn no"
                onClick={() => setOpenDeleteModal(false)}
              >
                No
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
export default Header;
