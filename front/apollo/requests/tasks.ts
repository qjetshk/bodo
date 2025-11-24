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