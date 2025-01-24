import {  useState } from 'react';
import { Draggable, Droppable } from "react-beautiful-dnd";
import DeleteModal from './DeleteModal';
import { useAuth } from '../hooks/useAuth';

export default function DroppableList({ id, items, label, tint, handleDelete }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const {user} = useAuth()
  const userID = user?._id
  
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
                  onDeleteClick={handleDeleteClick}
                  userID={userID}
                />
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>

      {deleteModal && (
        <DeleteModal 
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

const TaskList = ({ items, label, onDeleteClick, userID }) => (
  <ul className="list-none m-0 min-h-[500px] p-0 max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar relative flex-wrap max-w-[500px]">
    {items.map((item, index) => (
      <TaskItem
        key={item.id}
        item={item}
        index={index}
        userID = {userID}
        onDeleteClick={onDeleteClick}
      />
    ))}
  </ul>
);

const TaskItem = ({ item, index, onDeleteClick, userID }) => (
  <li className='list__item'>
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
       <div 
       className='flex flex-col bg-[hsl(214,13%,76%)] max-w-[500px] text-wrap rounded-[var(--border-radius-500)] cursor-pointer text-[hsl(228,19%,98%)] px-4 py-2 relative'
       {...provided.draggableProps}
       {...provided.dragHandleProps}
       ref={provided.innerRef}
     >
         <p className="text-lg font-semibold text-gray-600">{item?.name}</p>
       <p className="text-sm text-[#6c7482] mt-1 break-words">{item?.description}</p>
       {userID === item.user?._id ? (
         <DeleteButton onDelete={(e) => onDeleteClick(item, e)} />
       ) : null}
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