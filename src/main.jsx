import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Convite from './Convite'
import './styles/index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
          <Route path="/convite" element={<Convite />} />
          <Route path="/termos" element={<Termos />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
