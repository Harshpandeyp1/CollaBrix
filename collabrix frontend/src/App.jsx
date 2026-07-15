import { useState } from 'react'
import Login from './Pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import './App.css'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
