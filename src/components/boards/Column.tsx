import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { FC, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import TodoCard from '@/components/boards/TodoCard';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { useBoardStore } from '@/hooks';
import { Todo, TypedColumn } from '@/types';

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const Column: FC<Props> = ({ id, todos, index }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);

  const handleAddTodo = () => {
    setNewTaskType(id);

    setIsOpenModal(true);
  };

  return (
    <>
      <AddTaskModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />

      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/* Render droppable section */}
            <Droppable droppableId={index.toString()} type="card">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`pb-2 p-2 rounded-2xl shadow-sm ${
                    snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                  }`}
                >
                  <h2 className="flex justify-between font-bold text-xl p-2">
                    {idToColumnText[id]}

                    {/* Render number of todos */}
                    <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                      {!searchString
                        ? todos.length
                        : todos.filter((todo) =>
                            todo.title
                              .toLowerCase()
                              .includes(searchString.toLowerCase())
                          ).length}
                    </span>
                  </h2>

                  <div className="space-y-2">
                    {todos.map((todo, index) => {
                      if (
                        searchString &&
                        !todo.title
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      ) {
                        return null;
                      }

                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              draggableHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}

                    <div className="flex items-end justify-end p-2">
                      <button
                        className="text-green-500 hover:text-green-600"
                        onClick={handleAddTodo}
                      >
                        <PlusCircleIcon className="w-10 h-10" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
