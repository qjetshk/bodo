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

export const DELETE_BOARD = graphql(`
    mutation DeleteBoard($boardId: String!){
        deleteBoard(boardId: $boardId)
    }
`)

export const BOARD_DELETED = graphql(`
    subscription BoardDeleted {
        boardDeleted {
            id
            name
        }
    }
`)

