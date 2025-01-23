import React, { useState } from "react";
import { CREATE_POST } from "./API";

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

    if (!formValues.caption || !formValues.image) {
      alert("Caption and image are required!");
      return;
    }

    const formData = new FormData();
    formData.append("caption", formValues.caption);
    formData.append("photo", formValues.image);

    setLoading(true);
    const userData = localStorage.getItem("user");
    const parsedData = JSON.parse(userData);
    const token = parsedData._id;
    const accessToken = localStorage.getItem("accessToken")
    if (!token) {
      setError("No access token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${CREATE_POST}${token}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create feed post.");
      }

      const result = await response.json();
      onSubmit(result);
      onClose();
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
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
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
