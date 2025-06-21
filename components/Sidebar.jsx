import React, { useState, useEffect } from "react";
import { Navbar, Group, SidebarInput } from "./Navbar";

function Sidebar({
  isOpen,
  closeSidebar,
  lists,
  selectedListFilter,
  setSelectedListFilter,
  addNewList,
  setLists,
  tasks,
  setTasks,
}) {
  // Edit and Delete list
  const [activeListIndex, setActiveListIndex] = useState(null);

  const [editLabel, setEditLabel] = useState(""); // ✅ Fix this
  const [editListIndex, setEditListIndex] = useState(null);
  const [showEditListModal, setShowEditListModal] = useState(false);

  const handleEditList = (index) => {
    setActiveListIndex(null);

    setEditListIndex(index);
    setEditLabel(lists[index].label);
    setShowEditListModal(true);
  };

  const saveEditedLabel = () => {
    if (!editLabel.trim()) return;

    const oldLabel = lists[editListIndex].label;
    const newLabel = editLabel.trim();

    const updatedLists = [...lists];
    updatedLists[editListIndex].label = newLabel;
    setLists(updatedLists);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.list === oldLabel ? { ...task, list: newLabel } : task,
      ),
    );

    setEditListIndex(null);
    setEditLabel("");
    setShowEditListModal(false);
  };

  // Delete List
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [listToDeleteIndex, setListToDeleteIndex] = useState(null);

  const handleDeleteList = (index) => {
    setActiveListIndex(null);
    setListToDeleteIndex(index);
    setShowDeleteListModal(true);
  };

  const confirmDeleteList = () => {
    if (listToDeleteIndex === null) return;

    const listLabelToDelete = lists[listToDeleteIndex].label.trim();

    // Remove list and its tasks
    const updatedLists = lists.filter((_, i) => i !== listToDeleteIndex);
    setLists(updatedLists);

    const updatedTasks = tasks.filter(
      (task) => task.list && task.list.trim() !== listLabelToDelete,
    );
    setTasks(updatedTasks);

    // Save to localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("lists", JSON.stringify(updatedLists));

    // Close modal + reset states
    setShowDeleteListModal(false);
    setListToDeleteIndex(null);
    setActiveListIndex(null); // 👈 close box
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden rounded-r-2xl overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 text-xl font-bold border-b">TaskPilot</div>
        <nav className="p-4 space-y-2">
          <div className="relative">
            {lists.map((item, index) => (
              <div
                key={index}
                className="relative"
                onDoubleClick={() => setActiveListIndex(index)}
              >
                <Navbar
                  img={`/assets/img/${item.icon}.png`}
                  menu={item.label}
                  value={item.count}
                  selected={item.label === selectedListFilter}
                  onClick={() => {
                    setSelectedListFilter(item.label);
                    closeSidebar();
                  }}
                />

                {/* Edit/Delete Popup */}
                {activeListIndex === index && (
                  <div className="absolute top-2 left-[75%] bg-white border rounded shadow-md z-50 p-1 flex gap-1">
                    <button onClick={() => handleEditList(index)}>✏️</button>
                    <button onClick={() => handleDeleteList(index)}>🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <SidebarInput value="Create New List" onAdd={addNewList} />
          <div className="px-4 py-2 text-lg font-bold">Group</div>
          <div className="flex flex-wrap">
            <Group
              img="/assets/img/grp1.png"
              pnm="Mobal Project"
              people="5 People"
            />
            <Group
              img="/assets/img/grp2.png"
              pnm="Future Project"
              people="4 People"
            />
          </div>
          <a
            href="#"
            className="group  px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
          >
            <img
              src="/assets/img/plus.png"
              alt="plus"
              className="w-[20px] h-[20px]"
            />
            <span className="text-gray-700">Create New Group</span>
          </a>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 z-40 md:hidden" />
      )}

      {/* Desktop Sidebar */}
      <aside className="w-[20%] bg-white shadow-md hidden md:block rounded-2xl mx-5 my-2">
        <div className="p-4 text-xl font-bold text-left border-b ml-5">
          TaskPilot
        </div>
        <nav className="px-4 py-2 space-y-2 ">
          <div className="overflow-y-auto" style={{ height: "42vh" }}>
            <div className="relative">
              {lists.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onDoubleClick={() => setActiveListIndex(index)}
                >
                  <Navbar
                    img={`/assets/img/${item.icon}.png`}
                    menu={item.label}
                    value={item.count}
                    selected={item.label === selectedListFilter}
                    onClick={() => {
                      setSelectedListFilter(item.label);
                      closeSidebar();
                    }}
                  />

                  {/* Edit/Delete Popup */}
                  {activeListIndex === index && (
                    <div className="absolute top-2 left-[75%] bg-white border rounded shadow-md z-50 p-1 flex gap-1">
                      <button onClick={() => handleEditList(index)}>✏️</button>
                      <button onClick={() => handleDeleteList(index)}>
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <SidebarInput value="Create New List" onAdd={addNewList} />
          <div className="px-4 py-2 text-lg font-bold">Group</div>
          <div className="flex flex-wrap">
            <Group
              img="/assets/img/grp1.png"
              pnm="Mobal Project"
              people="5 People"
            />
            <Group
              img="/assets/img/grp2.png"
              pnm="Future Project"
              people="4 People"
            />
          </div>
          <a
            href="#"
            className="group  px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
          >
            <img
              src="/assets/img/plus.png"
              alt="plus"
              className="w-[20px] h-[20px]"
            />
            <span className="text-gray-700">Create New Group</span>
          </a>
        </nav>
      </aside>
      {showDeleteListModal && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity, 0.1))",
            }}
            onClick={() => setShowDeleteListModal(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
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
                    Delete List?
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This will remove the list{" "}
                    <strong>{lists[listToDeleteIndex]?.label}</strong> and all
                    tasks inside it.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={confirmDeleteList}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteListModal(false);
                    setListToDeleteIndex(null);
                    setActiveListIndex(null); // 👈 close box too
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showEditListModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setShowEditListModal(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.726z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit List Name
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Update the name for this list below:
                  </p>
                </div>
              </div>

              <input
                type="text"
                minLength={2}
                maxLength={50}
                className="mt-4 w-full border border-gray-300 px-4 py-2 rounded-md"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                autoFocus
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={saveEditedLabel}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowEditListModal(false);
                    setEditListIndex(null);
                    setEditLabel("");
                  }}
                  className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
