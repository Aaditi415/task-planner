import React, { useState, useEffect, useRef } from "react";

const TaskCard = ({
  task = "Read a book 📚",
  taskDate = "2025-04-10",
  onDelete,
  onEdit,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle fade and hide after checkbox is checked
  useEffect(() => {
    let fadeTimeout, hideTimeout;

    if (isChecked) {
      fadeTimeout = setTimeout(() => setIsFading(true), 400);
      hideTimeout = setTimeout(() => setIsHidden(true), 1000);
    } else {
      setIsFading(false);
      setIsHidden(false);
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isChecked]);

  // Handle outside click to close action menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`task-card bg-white m-1 md:m-2 px-4 md:px-6 py-2 flex flex-col md:flex-row rounded-md items-start md:items-center transition-all duration-500 ${isFading ? "opacity-0 scale-95" : "opacity-100"}`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isChecked}
          onClick={onDelete}
          onChange={() => setIsChecked(!isChecked)}
          className="w-5 h-5 rounded-full border-gray-300 checked:bg-blue-500 transition-all duration-200 hover:scale-110"
        />
        <span
          className={`task-text text-md text-gray-700 ${isChecked ? "line-through text-gray-400" : ""}`}
        >
          {task}
        </span>
      </div>

      <div className="flex ml-auto">
        <div className="bg-[#f4f4f4] rounded-md px-2 py-2 mr-2 flex items-center gap-2">
          <img
            src="/assets/img/dropdown1.png"
            alt="dropdown"
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-600">{taskDate}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="bg-[#f4f4f4] rounded-md px-4 py-1 flex items-center hover:bg-gray-200"
            aria-label="Options"
          >
            <span className="text-lg text-gray-600">&#8942;</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md z-50 rounded-md overflow-hidden">
              <button
                onClick={onEdit}
                className="w-full px-3 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
              >
                ✏️ Edit
              </button>
              <button
                onClick={onDelete}
                className="w-full px-3 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
