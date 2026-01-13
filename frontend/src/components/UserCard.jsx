import React from "react";

// Helper: first letter
const getInitial = (name = "") => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

// Helper: gradient color by name
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

const UserCard = ({ userInfo }) => {
  return (
    <div className="p-2 bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-white bg-gradient-to-br ${getAvatarColor(
              userInfo?.name
            )}`}
          >
            {userInfo?.profileImageUrl ? (
              <img
                src={userInfo.profileImageUrl}
                alt={userInfo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">
                {getInitial(userInfo?.name)}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <p className="text-lg font-medium">{userInfo?.name}</p>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="in-progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

// ----------------- StatCard -----------------

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div
      className={`flex flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded-lg items-center gap-1`}
    >
      <span className="text-[12px] font-semibold">{count}</span>
      <span>{label}</span>
    </div>
  );
};
