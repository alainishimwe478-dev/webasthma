import React from "react";
import { FaUserCircle } from "react-icons/fa";

const getInitials = (name) => {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!parts.length) return "U";

  return parts.map((part) => part[0].toUpperCase()).join("");
};

const UserAvatar = ({
  user,
  sizeClassName = "w-10 h-10",
  textClassName = "text-sm",
  iconClassName = "text-2xl",
  className = "",
}) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user?.name || "User"} profile`}
        className={`${sizeClassName} rounded-full object-cover shadow-sm ${className}`}
      />
    );
  }

  if (user?.name) {
    return (
      <div
        className={`${sizeClassName} rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold ${textClassName} ${className}`}
      >
        {getInitials(user.name)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center ${className}`}
    >
      <FaUserCircle className={iconClassName} />
    </div>
  );
};

export default UserAvatar;
