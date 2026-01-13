import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";

/* ------------ Loader ------------ */
const TasksLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 col-span-full">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
      <p className="text-gray-500 text-sm">Loading tasks...</p>
    </div>
  );
};

/* ------------ Empty State ------------ */
const EmptyState = ({ filterStatus }) => {
  return (
    <div className="col-span-full text-center py-24">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Tasks Found
      </h3>
      <p className="text-gray-500">
        {filterStatus === "All"
          ? "No tasks have been assigned to you yet."
          : `No tasks are currently marked as "${filterStatus}".`}
      </p>
    </div>
  );
};

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "In Progress", count: 0 },
    { label: "Completed", count: 0 },
  ]);
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

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Tasks
          </h2>

          <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {loading ? (
            <TasksLoader />
          ) : allTasks.length === 0 ? (
            <EmptyState filterStatus={filterStatus} />
          ) : (
            allTasks.map((item) => (
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
                onClick={() => handleClick(item._id)}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTask;
