import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./tailwind.css";
import Halaman from './Halaman';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Halaman/>
  </StrictMode>,
)
