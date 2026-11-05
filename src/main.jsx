import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { finishBoot } from './boot.js'
import './styles.css'

document.documentElement.classList.add('js')
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
requestAnimationFrame(() => requestAnimationFrame(finishBoot))
