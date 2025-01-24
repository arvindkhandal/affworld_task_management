import React, { useEffect, useState } from "react";
import LeadsOverview from "./LeadsOverview";
import TaskForm from "./TaskForm";
import { DELETE_TASK, GET_ALL_TASKS } from "./API";
import FeedForm from "./FeedForm";
import FeedList from "./FeedList";
import LogoutButton from "./LogoutButton";

const INITIAL_DATA = [
 { id: "af1", label: "Pending", items: [], tint: 1 },
 { id: "af4", label: "Completed", items: [], tint: 2 },
 { id: "af7", label: "Done", items: [], tint: 3 },
];

export default function TaskManagement() {
 const [userData, setUserData] = useState({
   userName: '',
   userMail: '',
   userID: ''
 });
 const [isPopupOpen, setIsPopupOpen] = useState(false);
 const [feedModal, setFeedModal] = useState(false);
 const [tasks, setTasks] = useState(INITIAL_DATA);
 const [refresh, setRefresh] = useState(false);

 useEffect(() => {
   const storedUser = localStorage.getItem("user");
   if (storedUser) {
     const { fullName, email, _id } = JSON.parse(storedUser);
     setUserData({ userName: fullName, userMail: email, userID: _id });
   }
 }, []);

 useEffect(() => {
   const fetchTasks = async () => {
     try {
       const response = await fetch(GET_ALL_TASKS, {
         method: "GET",
         headers: { "Content-Type": "application/json" },
       });

       if (!response.ok) throw new Error("Failed to fetch tasks.");

       const result = await response.json();
       if (result.success) setTasks(result.data);
     } catch (error) {
       console.error("Error fetching tasks:", error.message);
     }
   };

   fetchTasks();
 }, []);

 const handleAddTask = (newTask) => {
   setTasks(prev => 
     prev.map(ele => 
       ele.label === "Pending" 
         ? { ...ele, items: [...ele.items, newTask] }
         : ele
     )
   );
 };

 const handleDelete = async (id, label) => {
   try {
     const response = await fetch(`${DELETE_TASK}${id}`, {
       method: "DELETE",
       headers: { "Content-Type": "application/json" },
     });
 
     if (!response.ok) throw new Error("Failed to delete task");
 
     setTasks(prev => 
       prev.map(task => 
         task.label === label
           ? { ...task, items: task.items.filter(item => item.id !== id) }
           : task
       )
     );
   } catch (error) {
     console.error(error);
   }
 };

 return (
   <div className="layout__wrapper">
     <div className="header p-4 border-b-2 w-full border-gray-500 flex justify-between items-center">
       {userData.userName && userData.userMail ? (
         <div className="flex flex-col justify-start items-start w-[33.3%]">
           <span className="text-lg font-semibold text-white">
             {`Welcome, ${userData.userName}`}
           </span>
           <span className="text-sm text-white">{userData.userMail}</span>
         </div>
       ) : (
         <span className="text-white text-sm w-[33.3%]">User not logged in</span>
       )}
       <h1 className="text-2xl text-white font-bold w-[33.3%] text-center">
         Task Management System
       </h1>

       <div className="w-[33.3%] flex justify-end">
         <button
           onClick={() => setIsPopupOpen(true)}
           className="bg-gradient-to-r mr-2 from-[#028ce1] to-[#6a99e0] text-white px-4 py-2 rounded-md"
         >
           Add Task
         </button>
         <LogoutButton/>
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
         userID={userData.userID}
       />
     )}

     <div className="mx-auto mt-6 border-t-2 border-gray-500">
       <div className="header p-4 border-b-2 w-full border-gray-500 flex justify-between items-center">
         <h1 className="text-2xl text-white font-bold text-center">Feed Section</h1>

         <div className="flex justify-end">
           <button
             onClick={() => setFeedModal(true)}
             className="bg-gradient-to-r from-[#028ce1] to-[#6a99e0] text-white p-2 rounded"
           >
             Create Feed
           </button>
         </div>
       </div>

       {feedModal && (
         <FeedForm 
           onClose={() => setFeedModal(false)} 
           onSubmit={() => setRefresh(prev => !prev)} 
         />
       )}
       <FeedList key={refresh} />
     </div>
   </div>
 );
}