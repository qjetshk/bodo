import { graphql } from "../gql"

export const CHANGE_COLUMN_TITLE = graphql(`
    mutation ChangeColumnTitle($newTitle: String!, $columnId: String!){
        changeColumnTitle(newTitle: $newTitle, columnId: $columnId)
    }
`)

export const COLUMN_TITLE_CHANGED = graphql(`
    subscription ColumnTitleChanged{
        columnTitleChanged{
            id
            title
        }
    }
`)

export const CHANGE_COLUMNS_ORDER = graphql(`
  mutation ChangeColumnsOrder($changeColumnInput: [ChangeColumnOrderInput!]!, $boardId: ID!){
    changeColumnsOrder(changeColumnInput: $changeColumnInput, boardId: $boardId)
  }
`)

export const COLUMN_ORDER_CHANGED = graphql(`
    subscription ColumnOrderChanged{
        columnOrderChanged{
            boardId
            columns{
                id
                order
            }
        }
    }

`)

export const ADD_NEW_COLUMN = graphql(`
    mutation AddNewColumn($columnInput: AddNewColumnInput!){
        addNewColumn(columnInput: $columnInput)
    }   
`)

export const COLUMN_ADDED = graphql(`
    subscription ColumnAdded {
        columnAdded {
            boardId
            title
            id
            order
            tasks {
                id
                title
                description
                order
                columnId
                updatedAt
            }
        }
    }

`)

export const DELETE_COLUMN = graphql(`
    mutation DeleteColumn($columnId: String!){
        deleteColumn(columnId: $columnId)
    }
`)

export const COLUMN_DELETED = graphql(`
    subscription ColumnDeleted {
        columnDeleted {
            columns {
                id
                order
            }
        }
    }
`)