import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const url = "https://food-apps-653q.onrender.com"; // our deployed API

const api = axios.create({
  baseURL: url,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!err.response) {
      return Promise.reject(new Error('Network error. Please check your internet.'));
    }
    return Promise.reject(err);
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
  notification: "All",
};

const foodReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, allItems: action.payload, filteredItems: action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CATEGORY":
      return { ...state, comeCategory: action.payload };
    case "FILTER_ITEMS":
      return {
        ...state,
        filteredItems:
          state.comeCategory === "All"
            ? state.allItems
            : state.allItems.filter(item =>
                item.category.toLowerCase() === state.comeCategory.toLowerCase())
      };
    case "ADD_TO_CART":
      const item = action.payload;
      if (!item || !item._id) return state;
      const exist = state.cart.find(i => i._id === item._id);
      return exist
        ? { ...state, cart: state.cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i) }
        : { ...state, cart: [...state.cart, { ...item, quantity: 1 }] };
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter(i => i._id !== action.payload) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map(i =>
          i._id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i)
      };
    default:
      return state;
  }
};

export const FoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(foodReducer, initialState);

  // 1️⃣ Load from localStorage first
  useEffect(() => {
    const cached = localStorage.getItem("cachedFoods");
    if (cached) {
      const data = JSON.parse(cached);
      dispatch({ type: "SET_ITEMS", payload: data });
    }
  }, []);

  // 2️⃣ Fetch latest data from API after cache render
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        toast.loading("Loading foods from server...", { id: "fetch" });
        const res = await api.get("/api/foods");

        if (isMounted && res.data && Array.isArray(res.data)) {
          // ✅ Set in state
          dispatch({ type: "SET_ITEMS", payload: res.data });

          // ✅ Save to localStorage
          localStorage.setItem("cachedFoods", JSON.stringify(res.data));
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        toast.error(error.message);
      } finally {
        toast.dismiss("fetch");
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3️⃣ Filter update on category change
  useEffect(() => {
    dispatch({ type: "FILTER_ITEMS" });
  }, [state.comeCategory, state.allItems]);

  const value = {
    filteredItems: state.filteredItems,
    comeCategory: state.comeCategory,
    setComeCategory: (cat) => dispatch({ type: "SET_CATEGORY", payload: cat }),
    loading: state.loading,
    error: state.error,
    cart: state.cart,
    addToCart: (item) => dispatch({ type: "ADD_TO_CART", payload: item }),
    removeFromCart: (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
    getCartTotal: () => state.cart.reduce((t, i) => t + i.price * i.quantity, 0),
    url,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error("useFoodContext must be used within a FoodProvider");
  return context;
};

export default FoodContext;
