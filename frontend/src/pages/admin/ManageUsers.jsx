import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axioInstance";
import DashboardLayout from "../../components/DashboardLayout";
import { FaFileAlt } from "react-icons/fa";
import UserCard from "../../components/UserCard";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState(null);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users");
      setAllUsers(response.data || []);
    } catch (error) {
      console.log("Error fetching users: ", error);
      setAllUsers([]);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/users", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading report: ", error);
      toast.error("Error downloading user-details report. Please try again!");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>

          <button
            type="button"
            className="flex items-center gap-1 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-gray-800 rounded-lg font-medium shadow-sm"
            onClick={handleDownloadReport}
          >
            <FaFileAlt />
            Download Report
          </button>
        </div>

        {/* RENDER LOGIC */}
        <div className="mt-4">
          {allUsers === null ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500 text-sm animate-pulse">
                Loading team members...
              </p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500 text-sm">No team members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allUsers.map((user) => (
                <UserCard key={user._id} userInfo={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
