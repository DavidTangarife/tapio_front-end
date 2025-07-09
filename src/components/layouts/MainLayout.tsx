import { useState, useEffect } from 'react';
import Header from '../ui/Header'
import { Outlet } from 'react-router-dom';
import './MainLayout.css'

const MainLayout = () => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  //Fetch current project Id from session
  const fetchCurrentProjectId = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/session-project', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json()
      if (response.ok) {
        setCurrentProjectId(data.projectId);
      } else {
        throw new Error("Failed to set new Project Id")
      }
    } catch (err) {
      console.error("Error fetching project Id in session", err)
    }
  }

   useEffect(() => {
    fetchCurrentProjectId();
  }, []);

  return (
    <div className='App'>
      <main className='main-content'>
        <Header
          onProjectSwap={fetchCurrentProjectId}
        />
        <Outlet
          context={{ currentProjectId, setCurrentProjectId }}
        />
      </main>
    </div>
  )
}

export default MainLayout

