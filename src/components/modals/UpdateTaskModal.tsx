'use client';

import { FC, FormEvent, useEffect } from 'react';

import { getUrl } from '@/actions';
import Input from '@/components/inputs/Input';
import InputUpload from '@/components/inputs/InputUpload';
import TaskTypeRadioGroup from '@/components/inputs/TaskTypeRadioGroup';
import Modal from '@/components/modals/Modal';
import { useBoardStore } from '@/hooks';
import {
  Board,
  Column,
  Image as ImageType,
  Status,
  Todo,
  TypedColumn,
} from '@/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UpdateTaskModal: FC<Props> = ({ isOpen, onClose }: Props) => {
  const [
    board,
    setBoard,
    selectedTask,
    newTaskInput,
    setTaskInput,
    newTaskType,
    setNewTaskType,
    image,
    setImage,
    updataTodoInDB,
  ] = useBoardStore((state) => [
    state.board,
    state.setBoard,
    state.selectedTask,
    state.newTaskInput,
    state.setTaskInput,
    state.newTaskType,
    state.setNewTaskType,
    state.image,
    state.setImage,
    state.updataTodoInDB,
  ]);

  const getImage = async (image: ImageType) => {
    const url = await getUrl(image);

    const urlString = url.toString();

    setImage(urlString as string);
  };

  useEffect(() => {
    if (selectedTask) {
      setTaskInput(selectedTask.title);

      setNewTaskType(selectedTask.status);

      if (selectedTask.image) {
        getImage(selectedTask.image);
      }
    }
  }, [selectedTask]);

  const updateBoard = (newTaskType: TypedColumn, todo: Todo) => {
    if (!selectedTask) {
      return;
    }

    const copyBoardColumns: Map<TypedColumn, Column> = new Map(board.columns);

    let copyBoard: Board = { columns: copyBoardColumns };

    const newColumns = new Map(copyBoard.columns);

    const currentTaskTypeColumn = copyBoard.columns.get(
      selectedTask.status
    )?.todos;

    if (!currentTaskTypeColumn) {
      return;
    }

    const newArr: Todo[] = currentTaskTypeColumn?.filter(
      (todo) => todo.$id !== selectedTask.$id
    );

    newColumns.set(selectedTask.status, {
      id: selectedTask.status,
      todos: newArr,
    });

    setBoard({ ...copyBoard, columns: newColumns });

    copyBoard = { columns: newColumns };

    const newTaskTypeColumn = copyBoard.columns.get(newTaskType)?.todos;

    if (!newTaskTypeColumn) {
      return;
    }

    newTaskTypeColumn?.push(todo);

    newColumns.set(newTaskType, {
      id: newTaskType,
      todos: newTaskTypeColumn,
    });

    setBoard({ ...copyBoard, columns: newColumns });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTask) {
      return;
    }

    if (!newTaskInput) {
      return;
    }

    updataTodoInDB(
      { ...selectedTask, title: newTaskInput, status: newTaskType },
      newTaskType,
      image
    );

    updateBoard(newTaskType, {
      ...selectedTask,
      title: newTaskInput,
      status: newTaskType,
      ...(image && {
        image: {
          bucketId: (image as string).split('/')[6],
          fileId: (image as string).split('/')[8],
        },
      }),
    });

    setImage(null);

    onClose();
  };

  return (
    <Modal title="Add a task" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mt-2">
          <Input
            valueProps={newTaskInput}
            setValueProps={setTaskInput}
            id="task-input"
            placeholder="Enter a task here ..."
          />
        </div>

        <TaskTypeRadioGroup />

        <InputUpload />

        <button
          className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
          type="submit"
        >
          Update task
        </button>
      </form>
    </Modal>
  );
};

export default UpdateTaskModal;
