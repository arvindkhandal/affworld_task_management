import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER, GOOGLE, GOOGLE_CALLBACK, GOOGLE_AUTH_URL } from "./API";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LOGIN_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      setIsAuthenticated(true);
      navigate("/taskmanagement");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Open Google auth in a new window
    const width = 500;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const authWindow = window.open(
       GOOGLE_AUTH_URL, 
      'Google Authentication', 
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for messages from the popup
    const messageHandler = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { accessToken, refreshToken, user } = event.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        setIsAuthenticated(true);
        navigate("/taskmanagement");
        
        // Close the auth window
        authWindow?.close();
        
        // Remove event listener
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
  };

  // Handle Google auth callback (typically in a separate component)
  const handleGoogleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Fetch user data using the access token
      try {
        const response = await fetch('/api/users/current', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const userData = await response.json();
        
        localStorage.setItem("user", JSON.stringify(userData.data));
        setIsAuthenticated(true);
        navigate("/taskmanagement");
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Google authentication failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-[30rem] bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Sign In</h1>
        <p className="text-gray-500 text-center mt-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-medium">
            Create one
          </a>
        </p>
        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-2xl"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (<IoMdEye />) : (<IoMdEyeOff /> )}
              </div>
            </div>
          </div> 

          <div className="flex items-center justify-end text-sm">
            <a href="/forgot" className="text-indigo-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Sign in
          </button>

          <div className="text-center text-gray-500 mt-4">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <img
              src="https://static.cdnlogo.com/logos/g/38/google-icon.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;