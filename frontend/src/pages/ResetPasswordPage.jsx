import { useState } from "react";
import api from "../api/axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!token) {
      alert("Missing reset token. Use the link from your email.");
      return;
    }
    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: password,
      });
      alert("Password reset! Please log in.");
      navigate("/login");
    } catch {
      alert("Invalid or expired reset link");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Reset Password
        </button>
        <p className="text-center mt-4 text-gray-600">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
