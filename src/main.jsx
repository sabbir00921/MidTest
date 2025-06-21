import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contetx/Authcontext.jsx'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  </StrictMode>
)
