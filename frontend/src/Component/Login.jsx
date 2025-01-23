import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "./API";
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
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
