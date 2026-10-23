import Login from './Pages/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Pages/Landing'
import './App.css'
import Mainpage from './Pages/Mainpage'
import ProfilePage from './Pages/Profilepage'
import Connection from './Pages/Connection'
import Notifications from './Pages/Notifications'
import Project from './Pages/Project'
import Messages from './Pages/Message'
import Playground from './Pages/Playground'
import PlaygroundDetail from './Pages/PlaygroundDetail'
import OtherProfile from './Pages/OtherProfile'
import Ideas from './Pages/Ideas'
import SavedIdeas from './Pages/SavedIdeas'
import SavedProjects from './Pages/SavedProjects'
function App() {
  return (
      <div className="min-h-screen bg-[#FDFBD4] text-slate-900 transition-colors dark:bg-black dark:text-white">
    <BrowserRouter>
    <Routes>
    {/* your application */}
     <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mainpage" element={<Mainpage />} />
      <Route path="/ideas" element={<Ideas />} />
      <Route path="/saved-ideas" element={<SavedIdeas />} />
      <Route path="/saved-projects" element={<SavedProjects />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/notification" element={<Navigate to="/notifications" replace />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/Project" element={<Project />} />
      <Route path="/Messages" element={<Messages />} />
      <Route path="/Playground" element={<Playground />} />
      <Route
    path="/profile/:userId"
    element={<OtherProfile />}
/>
      <Route
  path="/playground/:projectId"
  element={<PlaygroundDetail />}
/>
      </Routes>
    
    </BrowserRouter>
     </div>
     
    
  )
}

export default App
