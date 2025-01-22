import { useState } from 'react';
import { Draggable, Droppable } from "react-beautiful-dnd";
import DeleteModal from './DeleteModal';

export default function DroppableList({ id, items, label, tint, handleDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setImagePreview(null);
    setCaption("");
  };

  const handleDeleteClick = (item, e) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete.id, label);
      setDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className={`holder holder--tint-${tint} min-w-[500px]`}>
              <div className='holder__content'>
                <TaskList
                  items={items}
                  label={label}
                  onItemClick={handleModalOpen}
                  onDeleteClick={handleDeleteClick}
                />
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>

      {isModalOpen && selectedItem && (
        <TaskModal
          item={selectedItem}
          imagePreview={imagePreview}
          caption={caption}
          onCaptionChange={(e) => setCaption(e.target.value)}
          onImageUpload={handleImageUpload}
          onClose={handleModalClose}
          onSubmit={handleModalClose}
        />
      )}

      {deleteModal && (
        <DeleteModal 
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

const TaskList = ({ items, label, onItemClick, onDeleteClick }) => (
  <ul className="list-none m-0 min-h-6 p-0 relative flex-wrap max-w-[500px]">
    {items.map((item, index) => (
      <TaskItem
        key={item.id}
        item={item}
        index={index}
        onClick={onItemClick}
        onDeleteClick={onDeleteClick}
      />
    ))}
  </ul>
);

const TaskItem = ({ item, index, onClick, onDeleteClick }) => (
  <li className='list__item'>
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          className='flex flex-col bg-[hsl(214,13%,76%)] max-w-[500px] text-wrap rounded-[var(--border-radius-500)] cursor-pointer text-[hsl(228,19%,98%)] px-4 py-2 relative'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => onClick(item)}
        >
          <p className="text-lg font-semibold text-gray-600">{item.label}</p>
          <p className="text-sm text-[#6c7482] mt-1 break-words">{item.description}</p>
          <DeleteButton onDelete={(e) => onDeleteClick(item, e)} />
        </div>
      )}
    </Draggable>
  </li>
);

const DeleteButton = ({ onDelete }) => (
  <button
    onClick={onDelete}
    className="absolute top-2 right-2 text-white p-1 rounded"
  >
    ❌
  </button>
);

const TaskModal = ({
	item,
	imagePreview,
	caption,
	onCaptionChange,
	onImageUpload,
	onClose,
	onSubmit,
}) => {
	const [submittedCaption, setSubmittedCaption] = useState('');

	const handleSubmit = () => {
		setSubmittedCaption(caption);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full min-w-[500px]">
				<h2 className="text-lg font-semibold text-gray-800 mb-1">{item.label}</h2>
				<p className="text-gray-600 mb-8 break-words">
					{item.description}
				</p>

				{submittedCaption && (
					<div className="mt-4">
						<h3 className="text-sm font-semibold text-gray-800">Submitted Caption:</h3>
						<p className="text-gray-600 mb-2">{submittedCaption}</p>
						<img
							src={imagePreview}
							alt="Preview"
							className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
						/>
					</div>
				)}

				<div className="mt-4">
					<label className="block text-gray-700 font-semibold mb-2">Upload Photo</label>
					<div className="border border-gray-300 rounded-lg p-4">
						<label
							htmlFor="file-upload"
							className="flex items-center justify-between cursor-pointer"
						>
							<span className="text-gray-500 text-sm">Choose a photo...</span>
							<span className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md ">
								Browse
							</span>
						</label>
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							onChange={onImageUpload}
							className="hidden"
						/>
					</div>
				</div>

				{imagePreview && (
					<div className="mt-4">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
						/>
					</div>
				)}

				<textarea
					className="w-full border p-2 mt-4 rounded-lg text-sm"
					placeholder="Add your caption..."
					value={caption}
					onChange={onCaptionChange}
				/>



				<div className="flex justify-end mt-6">
					<button
						className="mr-2 px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400 transition"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};