import React, { useState } from "react";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";

// Firebase config (replace this with your real config)
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
  const [isAuth, setIsAuth] = useState(true); // true = login, false = signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save user data to localStorage
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userName', user.displayName || name.trim());
      localStorage.setItem('userEmail', user.email);
      
      // Update user profile with display name if signing up
      if (!isAuth && name.trim()) {
        await updateProfile(user, {
          displayName: name.trim()
        });
      }
      
      toast.success("Google login success!");
      setAuth(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth && !name.trim()) {
      toast.error("Name is required for signup.");
      return;
    }

    if (isAuth) {
      // Login with email/password
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user data to localStorage
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', user.displayName || name.trim());
        localStorage.setItem('userEmail', user.email);
        
        toast.success("Logged in successfully!");
        setAuth(false);
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // Sign up with email/password
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user data to localStorage
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', name.trim());
        localStorage.setItem('userEmail', user.email);
        
        // Update user profile with display name
        await updateProfile(user, {
          displayName: name.trim()
        });
        
        toast.success("Account created successfully!");
        setAuth(false);
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="fixed top-0 py-10 z-50 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1f1c2c] to-[#928dab] p-6">
      <Toaster
        position="top-left"
        reverseOrder={true}
      />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-2 justify-between">
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
            {isAuth ? "Log In to Your Account" : "Create a New Account"}
          </h2>
          <button onClick={() => setAuth(false)} className="text-white/80 mx-auto hover:text-white transition">
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAuth && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-pink-400/30"
          >
            {isAuth ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-white/20" />
          <span className="px-3 text-sm text-white/70">OR</span>
          <hr className="flex-grow border-t border-white/20" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-white/80">
          {isAuth ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsAuth(!isAuth)}
            className="ml-2 text-pink-300 hover:underline"
          >
            {isAuth ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authpage;
