import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FoodProvider } from './Context/Context.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <FoodProvider>
      <App />
    </FoodProvider>
    </BrowserRouter>
  </StrictMode>,
)
