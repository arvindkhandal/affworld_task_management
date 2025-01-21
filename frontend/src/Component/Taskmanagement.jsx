import React, { useEffect, useState } from "react";
import LeadsOverview from "./LeadsOverview";
import TaskForm from "./TaskForm";

export const INITIAL_DATA = [
  { id: "af1", label: "Pending", items: [], tint: 1 },
  { id: "af4", label: "Completed", items: [], tint: 2 },
  { id: "af7", label: "Done", items: [], tint: 3 },
];

export default function TaskManagement() {
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_DATA);

  useEffect(() => {
    const userData = localStorage.getItem("users");

    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log(parsedData[0].name, 'pars')
      setUserName(parsedData[0]?.name);
      setUserMail(parsedData[0]?.email);
      console.log('yes')
    } else {
      console.log('nodara')
    }
  }, []);
  console.log(userName, userMail, 'data')

  const handleAddTask = (newTask) => {
    setTasks((prev) =>
      prev.map((ele) =>
        ele.label === "Pending"
          ? { ...ele, items: [...ele.items, newTask] }
          : ele
      )
    );
  };

  const handleDelete = (id, label) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.label === label
          ? {
            ...task,
            items: task.items.filter((item) => item.id !== id),
          }
          : task
      )
    );
  };

  return (
    <div className="layout__wrapper">
      <div className="header p-4 border-b-2 w-full border-gray-500 flex justify-between items-center">
        {userName && userMail ? (
          <div className="flex flex-col justify-start items-start w-[33.3%]">
            <span className="text-lg font-semibold text-white">{`Welcome, ${userName}`}</span>
            <span className="text-sm text-white">{userMail}</span>
          </div>
        ) : (
          <span className="text-white text-sm">User not logged in</span>
        )}
        <h1 className="text-2xl text-white font-bold w-[33.3%] text-center">Task Management System</h1>

        <div className="w-[33.3%] flex justify-end">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Task
          </button>
        </div>

      </div>
      <LeadsOverview
        DATA={tasks}
        handleDelete={handleDelete}
        setTasks={setTasks}
      />
      {isPopupOpen && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
}