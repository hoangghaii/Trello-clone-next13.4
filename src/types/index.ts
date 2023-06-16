export type Image = {
  bucketId: string;
  fileId: string;
};

export enum Status {
  todo = 'todo',
  inprogress = 'inprogress',
  done = 'done',
}

export type TypedColumn = keyof typeof Status;

export type Todo = {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
};

export type Column = {
  id: TypedColumn;
  todos: Todo[];
};

export type Board = {
  columns: Map<TypedColumn, Column>;
};
