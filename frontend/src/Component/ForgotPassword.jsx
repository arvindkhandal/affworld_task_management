import { useEffect, useState } from "react";
import { FORGOT_PASSWORD } from "./API";
import { useParams } from "react-router-dom";

const ForgotPassword = ({setResetToken}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowPopup(true);
        setMessage("Mail was sent please check");
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to send request. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-[400px] max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mt-2">Enter your email to reset your password.</p>

        <form className="mt-6 space-y-5" onSubmit={handleForgotPassword}>
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}
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
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
