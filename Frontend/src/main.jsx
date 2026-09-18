import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./features/cart/context/CartContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
    <CartProvider>
      <App />
      <Toaster />
      </CartProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
