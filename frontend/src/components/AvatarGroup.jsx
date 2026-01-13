import React from "react";

/* helpers */
const getInitial = (name = "") => (name ? name.charAt(0).toUpperCase() : "U");

const getAvatarColor = (name = "") => {
  const colors = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-green-500 to-green-700",
    "from-pink-500 to-pink-700",
    "from-orange-500 to-orange-700",
  ];

  if (!name) return colors[0];
  return colors[name.charCodeAt(0) % colors.length];
};

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center -space-x-3">
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gradient-to-br ${getAvatarColor(
            avatar.name
          )}`}
        >
          {avatar.image ? (
            <img
              src={avatar.image}
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {getInitial(avatar.name)}
            </span>
          )}
        </div>
      ))}

      {extraCount > 0 && (
        <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-semibold text-gray-700">
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
