import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './index.css'

// primreact css
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css"; // core css

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
