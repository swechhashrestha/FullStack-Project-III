import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";
import { LoginCredentials, authService } from "../../models/AuthClasses";

const Login = () => {
  const [credentials, setCredentials] = useState(new LoginCredentials());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser, setIsAuth } = useContext(AuthContext);

  const handleInputChange = (field, value) => {
    setCredentials(
      new LoginCredentials(
        field === "email" ? value : credentials.email,
        field === "password" ? value : credentials.password
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resData = await authService.login(credentials);

      setCredentials(new LoginCredentials());
      setUser(resData.user);
      setIsAuth(true);

      alert(resData.message || "Logged in successfully!");

      if (resData.user?.role === "admin") {
        navigate("/admin/user-management");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to Login User:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-rose-50/10 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-rose-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-amber-950 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-amber-700/70 font-medium mt-1.5">
            Sign in to manage your profile and orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-800/60">
                <FaEnvelope size={14} />
              </span>
              <input
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-rose-100 bg-rose-50/20 text-sm rounded-xl focus:ring-2 focus:ring-amber-900 focus:border-amber-900 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
              Account Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-800/60">
                <FaLock size={14} />
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-rose-100 bg-rose-50/20 text-sm rounded-xl focus:ring-2 focus:ring-amber-900 focus:border-amber-900 outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-950 hover:bg-yellow-950 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-amber-900/50 duration-200"
          >
            <FaSignInAlt size={14} />
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-900 font-bold hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;