import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Convite from './Convite'
import Termos from './Termos'   
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/convite" element={<Convite />} />
        <Route path="/termos" element={<Termos />} />   // ← GARANTA QUE ESTA ROTA EXISTE
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)



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
