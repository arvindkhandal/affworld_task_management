import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RESET_PASSWORD } from "./API";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${RESET_PASSWORD}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }

      const result = await response.json();
      console.log("API Response:", result);
      setMessage("Your password has been reset successfully.");
      navigate("/signin");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 text-center">Reset Password</h2>
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            onClick={() => setMessage("")}
          >
            Cancel
          </button>
          <button
            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg ${loading && "opacity-50 cursor-not-allowed"}`}
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
