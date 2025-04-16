import { createContext, useState, useContext, useEffect } from "react";
import  {foodItems}  from "../assets/Data.js";


export const FoodContext = createContext();

export const FoodProvider = ({children}) => {
    const[filteredItems, setFilteredItems] = useState(foodItems);
    const[comeCategory, setComeCategory] = useState("All");
     const filter = (category) => {
        if(category === "All"){
            setFilteredItems(foodItems);
        }else{
            setFilteredItems(foodItems.filter((item) => item.category === comeCategory.toUpperCase() || item.category === comeCategory.toLowerCase()));    
        }
     }

     useEffect(() => {
        filter(comeCategory);
     }, [comeCategory]);
   

    const value = { 
        filteredItems,
        setFilteredItems,
        filter,
        comeCategory,
        setComeCategory
    }

    return (      
        <FoodContext.Provider value={value }>
            {children}
        </FoodContext.Provider>
    )
}   

export const useFoodContext = () => {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error('useFoodContext must be used within a FoodProvider');
    }
    return context;
}

export default FoodContext;

