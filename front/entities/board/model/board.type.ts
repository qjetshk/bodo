import { GetInitialBoardQuery } from "@/apollo/gql/graphql";


type Board = GetInitialBoardQuery["getBoardById"]
type Column = Board['columns'][number]
type ColumnWithoutTasks = Omit<Column, 'tasks'>
type Task = Column['tasks'][number]
type TaskComments = NonNullable<Task['comments']>
type Comment = TaskComments[number]
export type Member = {
    __typename?: "User" | undefined;
    avatarUrl?: string | null | undefined;
    email: string;
    nickName: string;
    id: string;
}

export type { Board, Column, Task, ColumnWithoutTasks, Comment }