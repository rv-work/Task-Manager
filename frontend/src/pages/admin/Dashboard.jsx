import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axioInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import RecentTasks from "../../components/RecentTasks";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import DashboardEmptyState from "../../components/DashboardEmptyState";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare chart data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevel || {};

    setPieChartData([
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]);
  };

  // Fetch dashboard data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data");

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts);
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTasks = dashboardData?.charts?.taskDistribution?.All || 0;

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Welcome! {currentUser?.name}
              </h2>
              <p className="text-blue-100 mt-1">
                {moment().format("dddd Do MMMM YYYY")}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md"
                onClick={() => navigate("/admin/create-task")}
              >
                Create New Task
              </button>
            </div>
          </div>
        </div>

        {/* RENDER LOGIC */}
        {/* RENDER LOGIC */}
        {dashboardData === null ? (
          // 🔥 PURE LOADING STATE
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-sm animate-pulse">
              Loading dashboard...
            </p>
          </div>
        ) : totalTasks === 0 ? (
          // EMPTY STATE (after API)
          <DashboardEmptyState
            isAdmin
            onCreate={() => navigate("/admin/create-task")}
          />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Tasks"
                value={totalTasks}
                color="border-blue-500"
              />
              <StatCard
                title="Pending Tasks"
                value={dashboardData?.charts?.taskDistribution?.Pending || 0}
                color="border-yellow-500"
              />
              <StatCard
                title="In Progress Tasks"
                value={dashboardData?.charts?.taskDistribution?.InProgress || 0}
                color="border-green-500"
              />
              <StatCard
                title="Completed Tasks"
                value={dashboardData?.charts?.taskDistribution?.Completed || 0}
                color="border-red-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Task Distribution
                </h3>
                <div className="h-64">
                  <CustomPieChart data={pieChartData} colors={COLORS} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Task Priority Levels
                </h3>
                <div className="h-64">
                  <CustomBarChart data={barChartData} />
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <RecentTasks tasks={dashboardData?.recentTasks} admin />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color}`}>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);
