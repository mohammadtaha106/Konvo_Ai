import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Roompage from './pages/Room'
function App() {


  return (
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/room/:roomid' element={<Roompage/>}/>
    </Routes>
  )
}

export default App
