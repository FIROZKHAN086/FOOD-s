import React, { useState } from "react";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyANKpOEjn57Xjttxx4Veh82zUgk_GfuiR8",
  authDomain: "food-fc6a4.firebaseapp.com",
  projectId: "food-fc6a4",
  storageBucket: "food-fc6a4.appspot.com",
  messagingSenderId: "916931891471",
  appId: "1:916931891471:web:7dd311147fff2abab2ae7a",
  measurementId: "G-JBSVN0QWDH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Authpage = ({ setAuth }) => {
  const [isAuth, setIsAuth] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userName", user.displayName || name.trim());
      localStorage.setItem("userEmail", user.email);
      if (!isAuth && name.trim()) {
        await updateProfile(user, { displayName: name.trim() });
      }
      toast.success("Google login success!");
      setAuth(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth && !name.trim()) return toast.error("Name is required for signup.");

    try {
      const userCredential = isAuth
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userEmail", user.email);

      if (!isAuth) await updateProfile(user, { displayName: name.trim() });
      toast.success(isAuth ? "Logged in successfully!" : "Account created!");
      setAuth(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-lg z-50 flex items-center justify-center p-6">
      <Toaster position="top-left" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 relative"
      >
        <button
          onClick={() => setAuth(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-400 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          {isAuth ? "Welcome Back 👋" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAuth && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-xl text-white font-semibold shadow-md"
          >
            {isAuth ? "Log In" : "Sign Up"}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <FaGoogle />
          Continue with Google
        </motion.button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          {isAuth ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsAuth(!isAuth)}
            className="text-purple-500 hover:underline font-medium ml-1"
          >
            {isAuth ? "Sign up" : "Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Authpage;
