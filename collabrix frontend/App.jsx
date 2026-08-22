import { useEffect } from 'react'
import Login from './Pages/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Pages/Landing'
import './App.css'
import Mainpage from './Pages/Mainpage'
import ProfilePage from './Pages/Profilepage'
import Connection from './Pages/Connection'
import Notifications from './Pages/Notifications'
import Project from './Pages/Project'
function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <BrowserRouter>
    <Routes>
    {/* your application */}
     <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mainpage" element={<Mainpage />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/notification" element={<Navigate to="/notifications" replace />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/Project" element={<Project />} />
      </Routes>
    
    </BrowserRouter>
     </div>
     
    
  )
}

export default App

