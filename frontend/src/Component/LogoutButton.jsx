import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function LogoutButton() {
const [deleteModal, setDeleteModal] = useState(false);
const handleLogout = () => {
  localStorage.clear();

  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const [key] = cookie.split("=");
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  window.location.reload();
};

  return (
    <>
    <button
      onClick={()=>{setDeleteModal(true)}}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
    >
      Logout
    </button>
    {deleteModal && (
            <DeleteModal 
              onCancel={()=>{setDeleteModal(false)}}
              onConfirm={handleLogout}
            />
          )}
    </>
  );
}
