import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import { FaFileLines } from "react-icons/fa6";
import TaskCard from "../../components/TaskCard";
import toast from "react-hot-toast";

/* ---------------- Loader ---------------- */
const TasksLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
      <p className="text-gray-500 text-sm">Loading tasks...</p>
    </div>
  );
};

/* ---------------- Empty State ---------------- */
const EmptyState = ({ filterStatus, onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-6">
        <FaFileLines className="text-4xl text-blue-600" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No Tasks Found
      </h3>

      <p className="text-gray-500 max-w-md mb-6">
        {filterStatus === "All"
          ? "You haven’t created any tasks yet. Start by creating your first task."
          : `No tasks are currently marked as "${filterStatus}".`}
      </p>

      <button
        onClick={onCreate}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition cursor-pointer"
      >
        Create Task
      </button>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      if (response?.data) {
        setAllTasks(response.data?.tasks?.length ? response.data.tasks : []);
      }

      const statusSummary = response.data?.statusSummary || {};

      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]);
    } catch (error) {
      console.log("Error fetching tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "tasks_details.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading task-details report: ", error);
      toast.error("Error downloading task-details report. Please try again!");
    }
  };

  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Tasks
            </h2>

            <button
              className="md:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm cursor-pointer"
              onClick={handleDownloadReport}
              type="button"
            >
              Download
            </button>
          </div>

          {tabs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm cursor-pointer"
                onClick={handleDownloadReport}
                type="button"
              >
                <FaFileLines className="text-lg" />
                <span>Download Report</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <TasksLoader />
        ) : allTasks.length === 0 ? (
          <EmptyState
            filterStatus={filterStatus}
            onCreate={() => navigate("/admin/create-task")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map(
                  (user) => user.profileImageUrl
                )}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
