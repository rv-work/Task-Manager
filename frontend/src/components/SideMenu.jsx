import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";

// Helper: get first letter
const getInitial = (name = "") => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

// Helper: gradient color based on name
const getAvatarColor = (name = "") => {
  const colors = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-green-500 to-green-700",
    "from-pink-500 to-pink-700",
    "from-orange-500 to-orange-700",
  ];

  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sideMenuData, setSideMenuData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out");

      if (response.data) {
        dispatch(signOutSuccess());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      );
    }
  }, [currentUser]);

  return (
    <div className="w-64 p-6 h-full flex flex-col lg:border-r lg:border-gray-200">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`w-20 h-20 rounded-full mb-4 border-2 border-blue-200 flex items-center justify-center overflow-hidden bg-gradient-to-br ${getAvatarColor(
            currentUser?.name
          )}`}
        >
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {getInitial(currentUser?.name)}
            </span>
          )}
        </div>

        {currentUser?.role === "admin" && (
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Admin
          </div>
        )}

        <h5 className="text-lg font-semibold text-gray-800">
          {currentUser?.name || ""}
        </h5>

        <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
      </div>

      {/* Menu */}
      <div className="flex-1 overscroll-y-auto">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            onClick={() => handleClick(item.path)}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-2 rounded-lg transition
              ${
                activeMenu === item.label
                  ? "text-blue-600 bg-gradient-to-r from-blue-50/40 to-blue-100/60"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <item.icon className="text-2xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
