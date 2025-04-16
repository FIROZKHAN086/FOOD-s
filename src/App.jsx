import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Page/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer/>
    </div>
  )
}


export default App