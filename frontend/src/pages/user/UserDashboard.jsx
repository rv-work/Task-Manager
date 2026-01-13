import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axioInstance";
import moment from "moment";
import RecentTasks from "../../components/RecentTasks";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import DashboardEmptyState from "../../components/DashboardEmptyState";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [dashboardData, setDashboardData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // prepare data for pie chart
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevel || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data");

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.log("Error fetching user dashboard data: ", error);
    }
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">
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
          </div>
        </div>

        {dashboardData?.charts?.taskDistribution?.All === 0 ? (
          <DashboardEmptyState isAdmin={false} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Tasks
                </h3>
                <p className="text-3xl font-bold mt-2">
                  {dashboardData?.charts?.taskDistribution?.All || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-medium">
                  Pending Tasks
                </h3>
                <p className="text-3xl font-bold mt-2">
                  {dashboardData?.charts?.taskDistribution?.Pending || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium">
                  In Progress Tasks
                </h3>
                <p className="text-3xl font-bold mt-2">
                  {dashboardData?.charts?.taskDistribution?.InProgress || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm font-medium">
                  Completed Tasks
                </h3>
                <p className="text-3xl font-bold mt-2">
                  {dashboardData?.charts?.taskDistribution?.Completed || 0}
                </p>
              </div>
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
            <RecentTasks tasks={dashboardData?.recentTasks} admin={false} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
