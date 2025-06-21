import React, { useState } from "react";

export const Navbar = ({ menu, value, onClick, selected }) => {
  return (
    <a
      href="#"
      onClick={onClick}
      className={`group px-4 py-1 my-1 rounded hover:bg-gray-200 flex justify-between items-center  ${
        selected ? "bg-gray-200" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="text-2xl">{menu.slice(0, 2)}</span> {/* Emoji */}
        <span className="text-gray-700">{menu.slice(2).trim()}</span>{" "}
        {/* Label text */}
      </span>

      <span className="rounded-full bg-gray-200 group-hover:bg-white px-2">
        {value}
      </span>
    </a>
  );
};

export const Group = (props) => {
  return (
    <div className="px-3 mb-3">
      <img src={props.img} alt={props.pnm + " image"} />
      <span className="text-sm text-gray-700 block">{props.pnm}</span>
      <span className="text-xs text-gray-500 block">{props.people}</span>
    </div>
  );
};

export const SidebarInput = ({ value, onAdd }) => {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
      setEditing(false);
    }
  };

  return (
    <>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            minLength={2}
            maxLength={50}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setEditing(false)}
            placeholder="e.g., 📚 Reading"
            className="group px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2 w-full text-left"
          />
        </form>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="group px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2 w-full text-left"
        >
          <img
            src="/assets/img/plus.png"
            alt={value}
            className="w-[20px] h-[20px]"
          />
          <span className="text-gray-700">{value}</span>
        </button>
      )}
    </>
  );
};
