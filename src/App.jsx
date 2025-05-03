import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Page/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Cart from './Page/Cart'
import Authpage from './Page/Authpage'
import { Toaster } from 'react-hot-toast'
import Chekout from './Page/Chekout'
import MyOrders from './Page/MyOrdes'
import AdminDashboard from './Page/AdminPan/AdminDashboard'
import ManageFoods from './Page/AdminPan/ManageFoods'
import ManageOrders from './Page/AdminPan/ManageOrders'
import NotificationPage from './Page/Notification'
import ReviewPage from './Page/Reviwe'
import Account from './Page/Account'
import Contact from './Page/Contact'
import  AboutPage from './Components/AboutPage'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermsAndConditions from './Pages/TermsAndConditions'
import { Analytics } from "@vercel/analytics/react"
const App = () => {
  const [Auth, setAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const [item, setItem] = useState(null);
  

  useEffect(()=>{
    const isAdmin = localStorage.getItem("userId")
   
     if(isAdmin === "AyAZf2Qo3TXh7TP1H92JPD8Hydw2"){
      setIsAdmin(true)
    }
  },[])

  return (
    <div>
      <Analytics/>
      <Navbar setAuth={setAuth} IsAdmin={isAdmin} />
      {Auth ? <Authpage setAuth={setAuth} /> : <></>}

      <Toaster position="top-left" reverseOrder={true} />
      <Routes>
        <Route path="/" element={<Home setItem={setItem} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Chekout />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route
          path="/notification"
          element={<NotificationPage setAuth={setAuth} />}
        />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/aboutPage" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/foods" element={<ManageFoods />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
          </>
        )}
      </Routes>
      <Footer />
    </div>
  );
}


export default App
