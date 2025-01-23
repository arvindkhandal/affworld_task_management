import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Taskmanagement from "./Component/Taskmanagement";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import ForgotPassword from "./Component/ForgotPassword";

export default function App() {
  return (
    <Router>
      <div className="layout__wrapper flex flex-col justify-center items-center">
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />

          <Route path="/signin" element={<Login />} />
          
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/taskmanagement" element={<Taskmanagement />} />
        </Routes>
      </div>
    </Router>
  );
}
