import React, { useState } from 'react'

export default function TaskForm({ onSubmit, onClose }) {
    const [formValues, setFormValues] = useState({
        taskName: "",
        description: "",
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = {
          id: `task-${Date.now()}`,
          label: formValues.taskName,
          description: formValues.description,
        };
        onSubmit(newTask);
        onClose();
      };
    
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#E2E5E9] p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit}>
              <FormField
                label="Task Name"
                name="taskName"
                value={formValues.taskName}
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
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };
    const FormField = ({ label, name, value, onChange, isTextArea = false }) => (
        <div className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
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
      