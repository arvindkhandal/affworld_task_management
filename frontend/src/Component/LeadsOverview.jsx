import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DroppableList from './DroppableList';

export default function LeadsOverview({ DATA, handleDelete, setTasks }) {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState({});

  const buildAndSave = (items) => {
    const groups = {};
    items.forEach((currentGroup, i) => {
      groups[currentGroup.id] = i;
    });
    setItems(items);
    setTasks(items);
    setGroups(groups);
  };

  useEffect(() => {
    buildAndSave(DATA);
  }, [DATA]);

  const handleDragEnd = (result) => {
    const { destination, source, type } = result;
    
    if (!destination || (destination.droppableId === source.droppableId && 
        destination.index === source.index)) {
      return;
    }

    if (type === 'group') {
      const workValue = [...items];
      const [deletedItem] = workValue.splice(source.index, 1);
      workValue.splice(destination.index, 0, deletedItem);
      buildAndSave(workValue);
      return;
    }

    const sourceDroppableIndex = groups[source.droppableId];
    const targetDroppableIndex = groups[destination.droppableId];
    const sourceItems = [...items[sourceDroppableIndex].items];
    const targetItems = source.droppableId !== destination.droppableId 
      ? [...items[targetDroppableIndex].items] 
      : sourceItems;

    const [deletedItem] = sourceItems.splice(source.index, 1);
    targetItems.splice(destination.index, 0, deletedItem);

    const workValue = items.map((item, index) => {
      if (index === sourceDroppableIndex) {
        return { ...item, items: sourceItems };
      }
      if (index === targetDroppableIndex) {
        return { ...item, items: targetItems };
      }
      return item;
    });

    setItems(workValue);
    setTasks(workValue);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable>
        {(provided) => (
          <div
            className='flex w-[100%] justify-center flex-wrap'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((item, index) => (
              <TaskColumn
                key={item.id}
                item={item}
                index={index}
                handleDelete={handleDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const TaskColumn = ({ item, index, handleDelete }) => (
  <div className="border-x-2 border-gray-500 max-w-[33.3%] min-w-[500px] min-h-96">
    <div className={`holder holder--tint-${item.tint} w-full`}>
      <div className='holder__title'>{item.label}</div>
    </div>
    <DroppableList
      id={item.id}
      items={item.items}
      label={item.label}
      tint={item.tint}
      handleDelete={handleDelete}
    />
  </div>
);