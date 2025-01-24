import React, { useState } from "react";

export default function FeedForm({ onSubmit, onClose }) {
  const [formValues, setFormValues] = useState({
    caption: "",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormValues((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", formValues.caption);
    formData.append("photo", formValues.image);
    
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#E2E5E9] p-6 rounded shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Create New Feed Post</h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Caption"
            name="caption"
            value={formValues.caption}
            onChange={handleInputChange}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V12a4 4 0 018 0v4m5 0a2 2 0 11-4 0m-6 0a2 2 0 11-4 0M3 16h18M4 20h16"
                  ></path>
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop an image here, or <span className="text-blue-500">browse</span>
                </p>
              </div>
            </div>
          </div>

          {preview && (
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded my-3" />
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}

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
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Feed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FormField = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);