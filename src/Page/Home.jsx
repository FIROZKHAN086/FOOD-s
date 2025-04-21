import React , {useState, useEffect} from 'react'
import Hero from '../Components/Hero'
import Filter from '../Components/Filter'
import FoodMenu from '../Components/Food'
import App from '../Components/App'
import ItemDetails from '../Pages/Itemdetails'
export const Home = () => {
  const [item, setItem] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
   
    <div>
    {item ? <ItemDetails item={item} setItem={setItem} /> : <>
    
    <Hero />
        <Filter />
        <FoodMenu setItem={setItem} />
        <App/>
    </>}
     
       
    </div>
    </>
  )
}
