import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DroppableList from './DroppableList';
import { UPDATE_TASK } from './API';

export default function LeadsOverview({ DATA, handleDelete, setTasks }) {
 const [items, setItems] = useState([]);
 const [groups, setGroups] = useState({});

 const buildAndSave = (items) => {
   const newGroups = items.reduce((acc, group, index) => {
     acc[group.id] = index;
     return acc;
   }, {});

   setItems(items);
   setTasks(items);
   setGroups(newGroups);
 };

 useEffect(() => {
   buildAndSave(DATA);
 }, [DATA]);

 const updateApiCall = async (id, status) => {
   try {
     await fetch(`${UPDATE_TASK}${id}`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ status })
     });
   } catch (error) {
     console.error("Update task failed:", error);
   }
 };

 const handleDragEnd = (result) => {
   const { destination, source, type } = result;

   if (!destination || (destination.droppableId === source.droppableId && 
       destination.index === source.index)) return;

   const workValue = [...items];
   
   if (type === 'group') {
     const [removedItem] = workValue.splice(source.index, 1);
     workValue.splice(destination.index, 0, removedItem);
     buildAndSave(workValue);
     return;
   }

   const sourceIndex = groups[source.droppableId];
   const targetIndex = groups[destination.droppableId];
   const sourceItems = [...workValue[sourceIndex].items];
   const targetItems = source.droppableId !== destination.droppableId 
     ? [...workValue[targetIndex].items] 
     : sourceItems;

   const [movedItem] = sourceItems.splice(source.index, 1);
   targetItems.splice(destination.index, 0, movedItem);

   workValue[sourceIndex] = { ...workValue[sourceIndex], items: sourceItems };
   workValue[targetIndex] = { ...workValue[targetIndex], items: targetItems };

   const statusMap = {
     "af7": "Done",
     "af4": "Completed", 
     "af1": "Pending"
   };

   if (destination.droppableId in statusMap) {
     updateApiCall(result.draggableId, statusMap[destination.droppableId]);
   }

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
           {items.map((item) => (
             <TaskColumn
               key={item.id}
               item={item}
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

const TaskColumn = ({ item, handleDelete }) => (
 <div className="border-x-2 border-gray-500 max-w-[33.3%] min-w-[500px] min-h-[500px]">
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