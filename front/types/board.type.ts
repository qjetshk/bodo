import { GetInitialBoardQuery } from "@/apollo/gql/graphql";


type Board = GetInitialBoardQuery["getBoardById"]
type Column = Board['columns'][number]
type ColumnWithoutTasks = Omit<Column, 'tasks'>
type Task = Column['tasks'][number]

export type { Board, Column, Task, ColumnWithoutTasks }