import { useState } from 'react'
import Login from './Pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import './App.css'
import Mainpage from './Pages/Mainpage'
import ProfilePage from './Pages/Profilepage'
function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mainpage" element={<Mainpage />} />
      <Route path="/Profile" element={<ProfilePage />} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

