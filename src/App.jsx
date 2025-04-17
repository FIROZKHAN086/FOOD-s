import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Page/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Cart from './Page/Cart'
import Authpage from './Page/Authpage.jsx'
import { Toaster } from 'react-hot-toast'
import Chekout from './Page/Chekout'
import MyOrders from './Page/MyOrdes'
import AdminDashboard from './Page/AdminPan/AdminDashboard'
import ManageFoods from './Page/AdminPan/ManageFoods'
import ManageOrders from './Page/AdminPan/ManageOrders'

const App = () => {
  const [Auth, setAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    const isAdmin = localStorage.getItem("userId")
   
     if(isAdmin === "AyAZf2Qo3TXh7TP1H92JPD8Hydw2"){
      setIsAdmin(true)
    }
  },[])

  return (
    <div>

      <Navbar setAuth={setAuth} IsAdmin={isAdmin} />
      {Auth ? <Authpage setAuth={setAuth} /> : <></>}
      <Toaster
  position="top-left"
  reverseOrder={true}
/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Chekout />} />
        <Route path='/myorders' element={<MyOrders />} />
        {isAdmin && (
          <>
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/foods' element={<ManageFoods />} />
            <Route path='/admin/orders' element={<ManageOrders />} />
          </>
        )}
      </Routes>
      <Footer/>
    </div>
  )
}


export default App