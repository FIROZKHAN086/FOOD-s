import React from 'react'
import Hero from '../Components/Hero'
import Filter from '../Components/Filter'
import FoodMenu from '../Components/Food'
import App from '../Components/App'
import { useEffect } from 'react';
export const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
     <Hero />
        <Filter />
        <FoodMenu />
        <App/>
       
    </div>
  )
}
