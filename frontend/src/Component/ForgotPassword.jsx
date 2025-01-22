import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.email === email);

    if (!user) {
      setMessage("Email not found. Please check your email or sign up.");
      return;
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    user.password = tempPassword;
    localStorage.setItem("users", JSON.stringify(users));

    setMessage(`Your temporary password is: ${tempPassword}. Please log in and change your password.`);
  };

  return (
    <div className="flex justify-center items-cente px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mt-2">
          Enter your email and we will send you a temporary password.
        </p>

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

          <p className="text-center text-gray-500 mt-4">
            Remember your password?{" "}
            <span className="text-indigo-600 font-medium cursor-pointer" >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;