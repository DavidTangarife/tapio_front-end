import { useState } from 'react';
import Header from '../ui/Header'
import { Outlet, useLocation } from 'react-router-dom';
import './MainLayout.css'

const MainLayout = () => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const fetchCurrentProjectId = async () => {
    const response = await fetch('http://localhost:3000/api/session-project')
    const data = await response.json()
    console.log(data)
  }


  return (
    <div className='App'>
      <main className='main-content'>
        <Header
          currentProjectId={currentProjectId}
          setCurrentProjectId={setCurrentProjectId}
        />
        <Outlet
          context={{ currentProjectId, setCurrentProjectId }}
        />
      </main>
    </div>
  )
}

export default MainLayout

