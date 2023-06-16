import { XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';

import { getUrl } from '@/actions';
import ImageModal from '@/components/modals/ImageModal';
import UpdateTaskModal from '@/components/modals/UpdateTaskModal';
import { useBoardStore } from '@/hooks';
import { Todo, TypedColumn } from '@/types';

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  draggableHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard: FC<Props> = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  draggableHandleProps,
}: Props) => {
  const [isOpenImageModal, setIsOpenImageModal] = useState<boolean>(false);

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);

  const [deleteTask] = useBoardStore((state) => [state.deleteTask]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);

        if (url) {
          setImageUrl(url.toString());
        }
      };

      fetchImage();
    }
  }, [todo]);

  return (
    <>
      <ImageModal
        isOpen={isOpenImageModal}
        onClose={() => setIsOpenImageModal(false)}
        image={imageUrl}
      />

      <UpdateTaskModal
        isOpen={isOpenUpdateModal}
        onClose={() => setIsOpenUpdateModal(false)}
        todo={todo}
      />

      <div
        className="bg-white rounded-md space-y-2 drop-shadow-md"
        {...draggableProps}
        {...draggableHandleProps}
        ref={innerRef}
      >
        <div
          className="flex justify-between items-center p-5"
          onClick={() => setIsOpenUpdateModal(true)}
        >
          <p className="cursor-default">{todo.title}</p>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => deleteTask(index, todo, id)}
          >
            <XCircleIcon className="w-8 h-8 ml-5" />
          </button>
        </div>

        {imageUrl && (
          <div className="relative w-full h-[200px] overflow-hidden">
            <Image
              fill
              src={imageUrl}
              alt="Task Image"
              className="object-cover rounded-b-md cursor-pointer transition ease-in-out duration-200 hover:scale-125"
              priority
              onClick={() => setIsOpenImageModal(true)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TodoCard;
