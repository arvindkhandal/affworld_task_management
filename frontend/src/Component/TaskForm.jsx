import React, { useEffect, useState } from "react";
import { CREATE_TASK } from "./API";
import { useAuth } from "../hooks/useAuth";

export default function TaskForm({ onSubmit, onClose }) {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  const { user } = useAuth()
  const userId = user?._id
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User userId is not available. Please try again.");
      return;
    }

    try {
      const response = await fetch(`${CREATE_TASK}${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to add task. Please try again.");
      }

      const responseData = await response.json();

      const newTask = {
        id: responseData.data._id,
        label: responseData.data.name,
        description: responseData.data.description,
      };

      onSubmit(newTask);
      onClose();
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#E2E5E9] p-6 rounded shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Task Name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
          />
          <FormField
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            isTextArea
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 mr-3 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#028ce1] to-[#6a99e0] text-white px-4 py-2 rounded-md"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FormField = ({ label, name, value, onChange, isTextArea = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
);
