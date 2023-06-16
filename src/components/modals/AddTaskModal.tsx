'use client';

import { FC, FormEvent } from 'react';

import Input from '@/components/inputs/Input';
import InputUpload from '@/components/inputs/InputUpload';
import TaskTypeRadioGroup from '@/components/inputs/TaskTypeRadioGroup';
import Modal from '@/components/modals/Modal';
import { useBoardStore } from '@/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTaskModal: FC<Props> = ({ isOpen, onClose }: Props) => {
  const [newTaskInput, setTaskInput, newTaskType, image, setImage, addTask] =
    useBoardStore((state) => [
      state.newTaskInput,
      state.setTaskInput,
      state.newTaskType,
      state.image,
      state.setImage,
      state.addTask,
    ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTaskInput) {
      return;
    }

    addTask(newTaskInput, newTaskType, image);

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
          Add task
        </button>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
