import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Base URL configuration
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:5000"; // Development URL
  }
  return "https://food-apps-653q.onrender.com"; // Production URL
};

const url = getBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: url,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your internet connection.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }
    return Promise.reject(error);
  }
);

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
        error: null,
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
        return state;
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

  // Fetch data from backend with retry logic
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const fetchData = async () => {
      try {
        const response = await api.get('/api/foods');
        
        if (isMounted) {
          if (response.data && Array.isArray(response.data)) {
            dispatch({ type: "SET_ITEMS", payload: response.data });
          } else {
            throw new Error('Invalid data format received from server');
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        
        if (isMounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            const retryMessage = `Connection issue. Retrying (${retryCount}/${maxRetries})...`;
            toast.error(retryMessage);
            setTimeout(fetchData, retryDelay);
          } else {
            const errorMessage = error.message || 'Failed to load food items. Please check your internet connection and try again.';
            dispatch({ type: "SET_ERROR", payload: errorMessage });
            toast.error(errorMessage);
          }
        }
      }
    };

    // Check network connectivity before making request
    if (navigator.onLine) {
      fetchData();
    } else {
      dispatch({ 
        type: "SET_ERROR", 
        payload: "No internet connection. Please check your network and try again." 
      });
      toast.error("No internet connection. Please check your network and try again.");
    }

    // Add online/offline event listeners
    const handleOnline = () => {
      if (isMounted) {
        fetchData();
      }
    };

    const handleOffline = () => {
      if (isMounted) {
        dispatch({ 
          type: "SET_ERROR", 
          payload: "No internet connection. Please check your network and try again." 
        });
        toast.error("No internet connection. Please check your network and try again.");
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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
