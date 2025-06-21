import React, { useState } from "react";
import moment from "moment";
import "./calendar.css"; // Optional: for styles like .calendar, .active, .muted, etc.

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());

  const daysOfWeek = Array(7)
    .fill(0)
    .map((_, i) => moment().weekday(i).format("ddd"));

  const startOfMonth = moment(currentDate).startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day(); // Sunday = 0

  // Helper to generate all days for rendering (prev, current, next)
  const getCalendarDays = () => {
    const days = [];

    // Previous month's tail days
    const prevMonth = moment(currentDate).subtract(1, "month");
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = moment(prevMonth).date(prevMonthDays - i);
      days.push({ date, currentMonth: false });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      days.push({ date, currentMonth: true });
    }

    // Next month's leading days
    const nextMonth = moment(currentDate).add(1, "month");
    const nextDaysCount = 42 - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      const date = moment(nextMonth).date(i);
      days.push({ date, currentMonth: false });
    }

    return days;
  };

  const changeMonth = (offset) => {
    setCurrentDate(currentDate.clone().add(offset, "month"));
  };

  const resetToToday = () => {
    setCurrentDate(moment());
    setSelectedDate(moment());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect?.(date); // ✅ Pass selected date to Dashboard
    console.log("Selected Date:", date.format("YYYY-MM-DD"));
  };

  return (
    <div className="calendar">
      <nav className="calendar--nav flex justify-between items-center mb-2">
        <a onClick={() => changeMonth(-1)}>&#8249;</a>
        <h1
          className="cursor-pointer font-bold"
          onClick={resetToToday}
          dangerouslySetInnerHTML={{
            __html: `${currentDate.format("MMMM")} <small>${currentDate.format("YYYY")}</small>`,
          }}
        />
        <a onClick={() => changeMonth(1)}>&#8250;</a>
      </nav>

      <nav className="calendar--days grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {daysOfWeek.map((day, index) => (
          <span key={index} className="label font-medium">
            {day}
          </span>
        ))}
      </nav>

      <div className="calendar--grid grid grid-cols-7 gap-1 mt-2 text-center text-sm">
        {getCalendarDays().map(({ date, currentMonth }, idx) => {
          const isToday = moment().isSame(date, "day");
          const isSelected =
            selectedDate && moment(selectedDate).isSame(date, "day");

          return (
            <span
              key={idx}
              onClick={() => handleDateClick(date)}
              className={`cursor-pointer px-2 py-1 rounded ${
                !currentMonth ? "text-gray-300" : ""
              } ${isToday ? "bg-blue-100 font-bold" : ""} ${
                isSelected ? "bg-blue-500 text-white" : ""
              }`}
            >
              {date.date()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
