import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function LogoutButton() {
const [deleteModal, setDeleteModal] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
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
