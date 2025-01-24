import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../hooks/useAuth";

export default function LogoutButton() {
  const [deleteModal, setDeleteModal] = useState(false);
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()

  };

  return (
    <>
      <button
        onClick={() => { setDeleteModal(true) }}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
      {deleteModal && (
        <DeleteModal
          onCancel={() => { setDeleteModal(false) }}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
