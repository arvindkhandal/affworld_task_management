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
    }
  }, []);
  
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
          <span className="text-white text-sm w-[33.3%]">User not logged in</span>
        )}
        <h1 className="text-2xl text-white font-bold w-[33.3%] text-center">Task Management System</h1>

        <div className="w-[33.3%] flex justify-end">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-gradient-to-r from-[#028ce1] to-[#6a99e0] text-white p-2 rounded"
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