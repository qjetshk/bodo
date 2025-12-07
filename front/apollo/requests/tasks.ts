import { graphql } from "../gql";


export const CREATE_TASK = graphql(`
    mutation CreateTask($taskInput: CreateTaskInput!){
        createTask(taskInput: $taskInput)
    }
`)

export const TASK_CREATED = graphql(`
    subscription TaskCreated{
        taskCreated{
            columnId
            description
            id
            order
            title
            updatedAt
        }
    }
`)


export const DELETE_TASK = graphql(`
    mutation DeleteTask($taskId: String!){
        deleteTask(taskId: $taskId)
    }
`)

export const TASK_DELETED = graphql(`
    subscription TaskDeleted {
        taskDeleted {
            columnId
            boardUpdatedAt
            tasks {
                updatedAt
                description
                id
                order
                title
            }
        }
    }
`)

export const CHANGE_TASKS_ORDER = graphql(`
    mutation ChangeTasksOrder(
        $newTasks: [ChangeTaskOrderInput!]!
        $columnId: String!
    ) {
        changeTasksOrder(newTasks: $newTasks, columnId: $columnId)
    }
`)

export const TASKS_ORDER_CHANGED_IN_ONE_COLUMN = graphql(`
    subscription TasksOrderChangedInOneColumn {
        tasksOrderChangedInOneColumn {
            columnId
            tasks {
                id
                order
                columnId
            }
        }
    }
`)

export const MOVE_TASK_TO_ANOTHER_COLUMN = graphql(`
    mutation MoveTaskToAnotherColumn(
        $movedTaskId: String!
        $newIndex: Int!
        $prevColumnId: String!
        $curColumnId: String!
    ) {
        moveTaskToAnotherColumn(
            curColumnId: $curColumnId
            movedTaskId: $movedTaskId
            prevColumnId: $prevColumnId
            newIndex: $newIndex
        )
    }

`)

export const TASK_MOVED_TO_ANOTHER_COLUMN = graphql(`
    subscription TaskMovedToAnotherColumn {
        taskMovedToAnotherColumn {
            currentColumn {
                columnId
                tasks {
                    id
                    order
                }
            }
            prevColumn {
                columnId
                tasks {
                    id
                    order
                    columnId
                }
            }
        }
    }
`)