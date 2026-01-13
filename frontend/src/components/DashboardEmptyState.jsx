import { FaClipboardList } from "react-icons/fa6";

const DashboardEmptyState = ({ isAdmin, onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl shadow-sm">
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 mb-6">
        <FaClipboardList className="text-4xl text-blue-600" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No Tasks Yet
      </h3>

      <p className="text-gray-500 max-w-md mb-6">
        {isAdmin
          ? "You haven’t created any tasks yet. Start by creating your first task to track progress."
          : "No tasks have been assigned to you yet. Once tasks are assigned, they’ll appear here."}
      </p>

      {isAdmin && (
        <button
          onClick={onCreate}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition cursor-pointer"
        >
          Create First Task
        </button>
      )}
    </div>
  );
};

export default DashboardEmptyState;
