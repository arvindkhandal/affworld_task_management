import React from 'react'

export default function DeleteModal({onConfirm, onCancel}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <div className="flex justify-center mb-3">
        <span className="text-gray-500 text-3xl">⚠️</span>
      </div>
      <p className="text-lg font-semibold">Are you sure?</p>
      <div className="mt-4 flex justify-center space-x-3">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={onConfirm}
        >
          Yes, I'm sure
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={onCancel}
        >
          No, cancel
        </button>
      </div>
    </div>
  </div>
  )
}
