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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { loading } = useSelector((state) => state.user);

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

    setError(null);

    try {
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
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>

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
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-12"
                    placeholder="•••••••"
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

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium text-white transition
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            {/* Footer */}
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
