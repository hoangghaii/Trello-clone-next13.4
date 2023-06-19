'use client';

import { useRouter } from 'next/navigation';
import { FC, FormEvent, useEffect } from 'react';

import { getUrl } from '@/actions';
import Input from '@/components/inputs/Input';
import InputUpload from '@/components/inputs/InputUpload';
import TaskTypeRadioGroup from '@/components/inputs/TaskTypeRadioGroup';
import Modal from '@/components/modals/Modal';
import { useBoardStore } from '@/hooks';
import { Image as ImageType, Todo } from '@/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
};

const UpdateTaskModal: FC<Props> = ({ isOpen, onClose, todo }: Props) => {
  const [
    newTaskInput,
    setTaskInput,
    newTaskType,
    setNewTaskType,
    image,
    setImage,
    updataTodoInDB,
  ] = useBoardStore((state) => [
    state.newTaskInput,
    state.setTaskInput,
    state.newTaskType,
    state.setNewTaskType,
    state.image,
    state.setImage,
    state.updataTodoInDB,
  ]);

  const router = useRouter();

  console.log(router);

  const getImage = async (image: ImageType) => {
    const url = await getUrl(image);

    const urlString = url.toString();

    setImage(urlString as string);
  };

  useEffect(() => {
    setTaskInput(todo.title);

    setNewTaskType(todo.status);

    if (todo.image) {
      getImage(todo.image);
    }
  }, [todo]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTaskInput) {
      return;
    }

    updataTodoInDB(
      { ...todo, title: newTaskInput, status: newTaskType },
      newTaskType,
      image
    );

    setImage(null);

    onClose();

    router.refresh();
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
