import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

const url = "http://localhost:3000";
export const FoodContext = createContext();

const initialState = {
  allItems: [],
  filteredItems: [],
  comeCategory: "All",
  loading: true,
  error: null,
  cart: [],
};

const foodReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        allItems: action.payload,
        filteredItems: action.payload,
        loading: false,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        comeCategory: action.payload,
      };

    case "FILTER_ITEMS":
      return {
        ...state,
        filteredItems:
          state.comeCategory === "All"
            ? state.allItems
            : state.allItems.filter(
                item =>
                  item.category.toLowerCase() ===
                  state.comeCategory.toLowerCase()
              ),
      };

      case "ADD_TO_CART":
        const item = action.payload;
      
        if (!item || !item._id) {
          console.error("Invalid item passed to cart:", item);
          return state; // safely return without breaking
        }
      
        const exist = state.cart.find(i => i._id === item._id);
      
        if (exist) {
          return {
            ...state,
            cart: state.cart.map(i =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        } else {
          return {
            ...state,
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
        }
       
      

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(i => i._id !== action.payload),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

      case "UPDATE_QUANTITY": 
      return {
        ...state,
        cart: state.cart.map(i =>
          i._id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),  
      };
    
    
    default:
      return state;
  }
};

export const FoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(foodReducer, initialState);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/foods`);
        dispatch({ type: "SET_ITEMS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
    };
    fetchData();
  }, []);

  // Watch category change and filter
  useEffect(() => {
    dispatch({ type: "FILTER_ITEMS" });
  }, [state.comeCategory, state.allItems]);

  // Actions
  const setComeCategory = category => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  };

  const addToCart = item => {
    dispatch({ type: "ADD_TO_CART", payload: item });
    console.log(state.cart);
  };

  const removeFromCart = id => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    filteredItems: state.filteredItems,
    comeCategory: state.comeCategory,
    setComeCategory,
    loading: state.loading,
    error: state.error,
    cart: state.cart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    updateQuantity,
    url,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFoodContext must be used within a FoodProvider");
  }
  return context;
};

export default FoodContext;
