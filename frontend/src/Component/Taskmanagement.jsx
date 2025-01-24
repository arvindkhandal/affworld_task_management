import React, { useCallback, useEffect, useState } from "react";
import LeadsOverview from "./LeadsOverview";
import TaskForm from "./TaskForm";
import { DELETE_TASK, GET_ALL_TASKS } from "./API";
import FeedForm from "./FeedForm";
import FeedList from "./FeedList";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../hooks/useAuth";
import { GET_ALL_POSTS, DELETE_POST, CREATE_POST } from "./API";

const INITIAL_DATA = [
 { id: "af1", label: "Pending", items: [], tint: 1 },
 { id: "af4", label: "Completed", items: [], tint: 2 },
 { id: "af7", label: "Done", items: [], tint: 3 },
];

export default function TaskManagement() {
 const [isPopupOpen, setIsPopupOpen] = useState(false);
 const [feedModal, setFeedModal] = useState(false);
 const [tasks, setTasks] = useState(INITIAL_DATA);
 const [posts, setPosts] = useState([]);
 const [shouldRefetchPosts, setShouldRefetchPosts] = useState(false);
 const { user, accessToken } = useAuth();
 const { fullName, email, _id: userID } = user;

 // Fetch Tasks
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


 const fetchPosts = useCallback(async () => {
  try {
    if (!accessToken) throw new Error("Authorization token is missing.");
    const response = await fetch(GET_ALL_POSTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    if (data.success) setPosts(data.posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
  }
}, [accessToken]);

 // Fetch Posts
 useEffect(() => {


   if (accessToken) {
     fetchPosts();
   }
 }, [accessToken, shouldRefetchPosts]);

 // Add Task
 const handleAddTask = (newTask) => {
   setTasks(prev => 
     prev.map(ele => 
       ele.label === "Pending" 
         ? { ...ele, items: [...ele.items, newTask] }
         : ele
     )
   );
 };

 // Delete Task
 const handleDeleteTask = async (id, label) => {
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

 // Create Post
 const handleCreatePost = async (formData) => {
   try {
     const response = await fetch(`${CREATE_POST}${userID}`, {
       method: "POST",
       headers: {
         "Authorization": `Bearer ${accessToken}`,
       },
       body: formData,
     });

     if (!response.ok) {
       throw new Error("Failed to create feed post.");
     }

     setShouldRefetchPosts(true);
     setFeedModal(false);
   } catch (error) {
     console.error("Error creating post:", error.message);
   }
 };

 // Delete Post
 const handleDeletePost = async (postId) => {
   try {
     if (!accessToken) throw new Error("Authorization token is missing.");

     const response = await fetch(`${DELETE_POST}${postId}`, {
       method: "DELETE",
       headers: {
         "Authorization": `Bearer ${accessToken}`,
       },
     });

     if (!response.ok) throw new Error("Failed to delete the post");

     setShouldRefetchPosts(true);
   } catch (error) {
     console.error("Error deleting the post", error.message);
   }
 };

 return (
   <div className="layout__wrapper">
     <div className="header p-4 border-b-2 w-full border-gray-500 flex justify-between items-center">
       {fullName && email ? (
         <div className="flex flex-col justify-start items-start w-[33.3%]">
           <span className="text-lg font-semibold text-white">
             {`Welcome, ${fullName}`}
           </span>
           <span className="text-sm text-white">{email}</span>
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
       handleDelete={handleDeleteTask}
       setTasks={setTasks}
     />

     {isPopupOpen && (
       <TaskForm
         onSubmit={handleAddTask}
         onClose={() => setIsPopupOpen(false)}
         userID={userID}
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
           onSubmit={handleCreatePost}
         />
       )}
       <FeedList 
         posts={posts} 
         onDeletePost={handleDeletePost}
       />
     </div>
   </div>
 );
}