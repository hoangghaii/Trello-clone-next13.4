import { database } from '@/libs';
import { Board, Column, TypedColumn } from '@/types';

export const getTodosGroupedByColumn = async (): Promise<Board> => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, { id: todo.status, todos: [] });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status as TypedColumn,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  // if columns doesnt have inprogress, todo or done, add them with empty todos
  const columnsTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];

  for (const columnType of columnsTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, { id: columnType, todos: [] });
    }
  }

  // sort columns by `columnsTypes`
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnsTypes.indexOf(a[0]) - columnsTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
