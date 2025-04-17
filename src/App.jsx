import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Page/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Cart from './Page/Cart'
import Authpage from './Page/Authpage'
import { Toaster } from 'react-hot-toast'
const App = () => {
  const [Auth, setAuth] = useState(false)
  return (
    <div>

      <Navbar setAuth={setAuth} />
      {Auth ? <Authpage setAuth={setAuth} /> : <></>}
      <Toaster
  position="top-left"
  reverseOrder={true}
/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
      <Footer/>
    </div>
  )
}


export default App