import { create } from 'zustand';

import { getTodosGroupedByColumn, uploadImage } from '@/actions';
import { database, ID, storage } from '@/libs';
import { Board, Column, Image, Status, Todo, TypedColumn } from '@/types';

type Props = {
  board: Board;

  getBoard: () => void;

  setBoard: (board: Board) => void;

  updataTodoInDB: (
    todo: Todo,
    columnId: TypedColumn,
    image?: File | string | null
  ) => void;

  searchString: string;

  setSearchString: (searchString: string) => void;

  newTaskInput: string;

  setTaskInput: (newTaskInput: string) => void;

  newTaskType: TypedColumn;

  setNewTaskType: (columnId: TypedColumn) => void;

  image: string | File | null;

  setImage: (image: string | File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, images?: File | null) => void;

  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  selectedTask: Todo | null;

  setSelectedTask: (todo: Todo | null) => void;
};

export const useBoardStore = create<Props>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();

    set({ board });
  },

  setBoard: (board) => set({ board }),

  updataTodoInDB: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image && typeof image !== 'string') {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
  },

  searchString: '',

  setSearchString: (searchString) => set({ searchString }),

  newTaskInput: '',

  setTaskInput: (newTaskInput) => set({ newTaskInput }),

  newTaskType: Status.todo,

  setNewTaskType: (columnId) => set({ newTaskType: columnId }),

  image: null,

  setImage: (image) => set({ image: image }),

  addTask: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: '' });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return { board: { columns: newColumns } };
    });
  },

  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);

    // delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      todo.$id
    );
  },

  selectedTask: null,

  setSelectedTask: (todo) => set({ selectedTask: todo }),
}));
