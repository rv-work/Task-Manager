import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/userSlice";

const DEMO_USERS = [
  {
    role: "Admin",
    email: "prajakta@gmail.com",
    password: "Prajakta",
    color: "bg-purple-100 text-purple-700",
  },
  {
    role: "Employee 1",
    email: "rv@gmail.com",
    password: "RV@123",
    color: "bg-blue-100 text-blue-700",
  },
  {
    role: "Employee 2",
    email: "rv2@gmail.com",
    password: "RV@123",
    color: "bg-green-100 text-green-700",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { loading } = useSelector((state) => state.user);

  const handleDemoFill = (email, password) => {
    setEmail(email);
    setPassword(password);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    try {
      setError(null);
      dispatch(signInStart());

      const response = await axiosInstance.post(
        "/auth/sign-in",
        { email, password },
        { withCredentials: true }
      );

      dispatch(signInSuccess(response.data));

      navigate(
        response.data.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again!";
      setError(message);
      dispatch(signInFailure(message));
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-6">
        {/* 🔹 Demo Credentials */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            Demo Login (One Click)
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                disabled={loading}
                onClick={() => handleDemoFill(user.email, user.password)}
                className={`flex justify-between items-center px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-[1.01] ${user.color}`}
              >
                <span>{user.role}</span>
                <span className="text-xs opacity-70">Click to autofill</span>
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Login Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPeopleGroup className="text-4xl text-blue-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mt-4 uppercase">
                Project Flow
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your projects efficiently
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-12 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 text-gray-500"
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white font-medium transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
