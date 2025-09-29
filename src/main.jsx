import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "video-react/dist/video-react.css";

import { ToastContainer, Bounce } from "react-toastify"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bg-orange-400 w-full h-20 flex items-center p-6 gap-6">
      <img className='rounded-2xl w-10' src="logo.svg" alt="" />
      <p className='pr-16 text-2xl text-white font-bold'>Shuego</p>
    </div>
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    <div className="xl:m-15 lg:m-10 m-5"> 
      <App />
    </div>
  </StrictMode>,
)
