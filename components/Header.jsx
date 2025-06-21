import React, { useState, useEffect } from "react";

const Header = ({ userName = "Ankita", toggleSidebar, isSidebarOpen }) => {
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    const greet =
      hour >= 5 && hour < 12
        ? "Good Morning"
        : hour < 17
          ? "Good Afternoon"
          : hour < 21
            ? "Good Evening"
            : "Good Night";
    setGreeting(`${greet}, ${userName}! 👋`);

    const options = {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const today = new Date().toLocaleDateString("en-GB", options);
    setDateStr(`Today, ${today}`);
  }, [userName]);

  // reset Model
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    localStorage.removeItem("tasks");
    localStorage.removeItem("lists");
    location.reload();
  };

  return (
    <>
      {/* Main Content */}

      <main className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 items-start sm:items-center">
        <div className="header mb-4 sm:mb-0">
          <h1 id="greeting" className="text-xl sm:text-2xl font-semibold">
            {greeting}
          </h1>
          <p
            id="dateDisplay"
            className="mt-1 text-gray-600 text-sm sm:text-base"
          >
            {dateStr}
          </p>
        </div>
        <div className="flex space-x-2 sm:space-x-4 ml-auto">
          <div
            className="hidden sm:flex bg-white text-red-600 hover:bg-red-100 px-5 py-2 rounded-md items-center shadow-sm cursor-pointer gap-1"
            onClick={() => setShowConfirm(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4l1 11a2 2 0 002 2h6a2 2 0 002-2l1-11h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm3 4a.5.5 0 011 0v8a.5.5 0 01-1 0V6zm3 0a.5.5 0 011 0v8a.5.5 0 01-1 0V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-sm">Reset Workspace</span>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                style={{
                  backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity, 0.1))",
                }}
                onClick={() => setShowConfirm(false)}
              ></div>

              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75M12 15.75h.008v.008H12v-.008z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.697 16.126c-.866 1.5.217 3.374 1.948 3.374h12.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L3.697 16.126z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Clear Workspace?
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        This will permanently delete all tasks and lists from
                        your workspace.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={handleClear}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex  mt-[-70px] sm:mt-0 py-0 sm:py-2 lg:hidden  bg-white px-3  rounded-md  items-center justify-center shadow-sm">
            <button
              onClick={toggleSidebar}
              className="text-lg sm:text-xl text-gray-700"
            >
              {isSidebarOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Header;
