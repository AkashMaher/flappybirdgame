import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageModal from './components/ImageModal';
import PlayGame from './components/PlayGame';
import { GlobalContextProvider } from './context';
import UploadFile from './components/UploadFile';
ReactDOM.createRoot(document.getElementById('root')).render(
  
<GlobalContextProvider>
  <BrowserRouter>
      <Routes>
      <Route path="/" element={ <App />}  />
     <Route path="/mint" element={<UploadFile/>} />
  <Route path="/select-image" element={<ImageModal />} />
      <Route path='/play' element={<PlayGame  />}  />
      </Routes>
      </BrowserRouter>
      
      </GlobalContextProvider>
)
