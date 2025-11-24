import { graphql } from "../gql";


export const GET_ALL_USER_BOARDS_FOR_NAVIGATION = graphql(`
    query GetAllUserBoardsForNavigation {
        getAllUserBoards {
            id
            name
            description
            createdAt
        }
    }
`)

export const GET_ALL_USER_BOARDS_FOR_DASHBOARD = graphql(`
    query GetAllUserBoardsForDashboard {
        getAllUserBoards {
            id
            name
            description
            createdAt
            updatedAt
            owner {
                email
                nickName
                avatarUrl
            }
            members {
                user {
                    avatarUrl
                    nickName
                }
            }
        }
    }
`)

export const CREATE_BOARD = graphql(`
    mutation CreateBoard($boardInput: CreateBoardInput!) {
        createBoard(boardInput: $boardInput) {
            id
        }
    }

`)

export const GET_INITIAL_BOARD = graphql(`
    query GetInitialBoard($boardId: String!) {
        getBoardById(boardId: $boardId) {
            boardType
            name
            description
            id
            createdAt
            members{
                user{
                    avatarUrl
                    email
                    nickName
                    id
                }
            }
            owner{
                avatarUrl
                email
                nickName
                id
            }
            columns {
                id
                order
                title
                tasks {
                    description
                    id
                    order
                    title
                    updatedAt
                    columnId
                }
            }
        }
    }
`)

export const EDIT_BOARD = graphql(`
    mutation EditBoard($boardId: String!, $editBoardInput: EditBoardInput!) {
        editBoard(editBoardInput: $editBoardInput, boardId: $boardId) {
            id 
            name 
            description 
            updatedAt
        }
    }
`)

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


export const BOARD_EDITED = graphql(`
    subscription BoardEdited{
        boardEdited{
            description
            id
            name
            updatedAt
        }
    }
`)