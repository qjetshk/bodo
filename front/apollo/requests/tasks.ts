import { graphql } from "../gql";


export const CREATE_TASK = graphql(`
    mutation CreateTask($taskInput: CreateTaskInput!){
        createTask(taskInput: $taskInput)
    }
`)

export const TASK_CREATED = graphql(`
    subscription TaskCreated {
        taskCreated {
            columnId
            description
            id
            order
            title
            updatedAt
            deadlineDate
            priority
            comments {
                author {
                    avatarUrl
                    nickName
                    id
                }
                content
                id
                content
            }
            assignments {
                user {
                    avatarUrl
                    email
                    id
                    nickName
                }
            }
        }
    }
`)

export const EDIT_TASK = graphql(`
    mutation EditTask($taskInput: EditTaskInput!){
        editTask(taskInput: $taskInput)
    }
`)

export const TASK_EDITED = graphql(`
    subscription TaskEdited {
        taskEdited {
            description
            id
            order
            title
            updatedAt
            columnId
            priority
            deadlineDate
            assignments {
                user {
                    avatarUrl
                    email
                    id
                    nickName
                }
            }
            comments {
                content
                id
                updatedAt
                author {
                    avatarUrl
                    nickName
                    id
                }
            }
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
            taskId
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
