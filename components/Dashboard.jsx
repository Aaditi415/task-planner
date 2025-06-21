import React, { useState, useEffect, useRef } from "react";
import TaskCard from "./TaskCard";
import Calendar from "./Calender";
import dayjs from "dayjs";

function Dashboard({ lists, setLists, selectedListFilter, tasks, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // add task
  const [taskName, setTaskName] = useState("");

  const [selectedList, setSelectedList] = useState(null);

  // store locally

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // for all task count

  useEffect(() => {
    const updatedCounts = lists.map((list) => {
      if (list.label === "✅ All") {
        return { ...list, count: allTasks.length };
      }

      const count = allTasks.filter((task) => task.list === list.label).length;
      return { ...list, count };
    });

    setLists(updatedCounts);
  }, [tasks]);

  const [selectedDate, setSelectedDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const allTasks = React.useMemo(
    () => [
      // { name: "Read a book 📚", taskDate: "2025-04-10", list: "🔑 Personal" },
      // { name: "Wireframing new product 🖊️", taskDate: "2025-04-12", list: "💼 Work" },
      // { name: "Moodboard Landing Page 🖼️", taskDate: "2025-05-19", list: "💼 Work" },
      // { name: "Weekly meeting 🗓️", taskDate: "2025-05-21", list: "💼 Works" },
      // { name: "Design PPT for Sharing Session 👩‍💻", taskDate: "2025-06-05", list: "💼 Works" },
      // { name: "Exercise 💪", taskDate: "2025-06-11", list: "💪 Diet" },
      // { name: "Pune Trip 🚗", taskDate: "2025-06-21", list: "🗺️ Road trip list" },
      ...tasks,
    ],
    [tasks],
  );

  const filteredTasks =
    selectedListFilter === "✅ All"
      ? allTasks
      : allTasks.filter((task) => task.list === selectedListFilter);

  // console.log(selectedListFilter);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);

  // delete task

  const deleteTask = (indexToDelete) => {
    const staticCount = 0;
    const taskToDelete = allTasks[indexToDelete];

    const newAllTasks = allTasks.filter((_, idx) => idx !== indexToDelete);
    const updatedDynamic = newAllTasks.slice(staticCount);
    setTasks(updatedDynamic);

    if (taskToDelete?.list) {
      setLists((prevLists) =>
        prevLists.map((item) =>
          item.label === taskToDelete.list && item.count > 0
            ? { ...item, count: item.count - 1 }
            : item,
        ),
      );
    }
  };

  // edit task
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // date select message
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <>
      {/* Task Cards */}
      <div className="cards p-4">
        {currentTasks.length > 0 ? (
          currentTasks.map((task, index) => (
            <TaskCard
              key={index}
              task={task.name}
              taskDate={task.taskDate}
              onDelete={() => deleteTask(index + indexOfFirst)}
              onEdit={() => {
                const realIndex = index + indexOfFirst;
                const editingTask = tasks[realIndex];

                if (!editingTask) {
                  alert("Task not found!");
                  return;
                }

                setTaskName(editingTask.name);
                setSelectedList(editingTask.list);
                setSelectedDate(dayjs(editingTask.taskDate));
                setEditIndex(realIndex);
                setIsEditing(true);
                setIsDropdownOpen(false);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div
            className={`bg-white text-gray-700 text-xl m-1 md:m-2 px-4 md:px-6 py-2 text-center`}
          >
            No task yet!
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 my-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-full border border-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          «
        </button>

        {/* Numbered buttons */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-full border ${
              currentPage === index + 1
                ? "bg-[#6190CF] text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              currentPage < totalPages ? prev + 1 : prev,
            )
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          »
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity, 0.1))" }}
          onClick={() => {
            setIsModalOpen(false);
            setIsDropdownOpen(false);
          }}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="w-[90%] bottom-10 left-[5%] absolute sm:bottom-[90px] sm:left-[48%] sm:w-[26%] z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <div className="flex items-center bg-[#f4f4f4] px-4 py-2 rounded-lg">
              <input
                type="text"
                placeholder="Create new task"
                name="task"
                minLength={2}
                maxLength={50}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-transparent outline-none text-md text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Dropdown */}
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-[80%]">
                <button
                  ref={toggleRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="w-full flex justify-between items-center border-2 border-gray-300 bg-white rounded-lg px-4 py-2 text-gray-800 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedList || "Select List"}</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-[110%] left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                  >
                    {lists.slice(1).map((item, idx) => (
                      <label
                        key={idx}
                        onClick={() => {
                          setSelectedList(item.label);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                          selectedList === item.label ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <span className="text-gray-800">{item.label}</span>
                        </div>
                        <span className="rounded-full bg-gray-200 px-2">
                          {item.count}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <button className="w-[10%] p-2 hover:bg-gray-700 hover:text-white rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              <button className="w-[10%] p-2 hover:bg-gray-700 hover:text-white rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <Calendar onDateSelect={(date) => setSelectedDate(date)} />

            <button
              className="mt-4 bg-[#075FFA] px-5 py-2 rounded-full w-full text-white shadow-lg hover:bg-[#F0F3FE] hover:text-[#6190CF]"
              onClick={() => {
                if (!selectedList || !selectedDate) {
                  setAlertMessage("Please select both a list and a date!");
                  setShowAlertModal(true);
                  return;
                }

                const updatedTask = {
                  name: taskName,
                  taskDate: selectedDate.format("YYYY-MM-DD"),
                  list: selectedList,
                };

                if (isEditing) {
                  const oldTask = tasks[editIndex];
                  const newTasks = [...tasks];
                  newTasks[editIndex] = updatedTask;
                  setTasks(newTasks);

                  // If list is changed, update counts
                  if (oldTask.list !== selectedList) {
                    setLists((prev) =>
                      prev.map((item) => {
                        if (item.label === oldTask.list && item.count > 0) {
                          return { ...item, count: item.count - 1 };
                        }
                        if (item.label === selectedList) {
                          return { ...item, count: item.count + 1 };
                        }
                        return item;
                      }),
                    );
                  }

                  setIsEditing(false);
                  setEditIndex(null);
                } else {
                  // New Task
                  setTasks((prev) => [...prev, updatedTask]);

                  setLists((prev) =>
                    prev.map((item) =>
                      item.label === selectedList
                        ? { ...item, count: item.count + 1 }
                        : item,
                    ),
                  );
                }

                // Reset
                setIsModalOpen(false);
                setSelectedList(null);
                setSelectedDate(null);
                setTaskName("");
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Fixed Button */}
      <div className="fixed bottom-6 left-[0%] right-0 mx-auto w-full max-w-xs sm:left-[22%] md:max-w-md px-4 z-30">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-950 px-6 py-3 rounded-full w-full text-white shadow-lg hover:bg-gray-800"
        >
          + Create new task
        </button>
      </div>

      {showAlertModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setShowAlertModal(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-yellow-600"
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
                    Missing Fields
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{alertMessage}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
