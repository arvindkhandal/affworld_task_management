import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Taskmanagement from "./Component/Taskmanagement";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import ForgotPassword from "./Component/ForgotPassword";
import { useEffect, useState } from "react";
import ResetPassword from "./Component/ResetPassword";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="layout__wrapper flex flex-col justify-center items-center">
        <Routes>
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/taskmanagement" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/taskmanagement" replace /> : <Signup />} />
          <Route
            path="/forgot-password/:token"
            element={<ResetPassword setResetToken={setResetToken} />}
          />
          <Route
            path="/forgot"
            element={<ForgotPassword setResetToken={setResetToken} />}
          />
          <Route
            path="/taskmanagement"
            element={isAuthenticated ? <Taskmanagement /> : <Navigate to="/signin" replace />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/taskmanagement" : "/signin"} replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/taskmanagement" : "/signin"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}






