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
                }
            }
        }
    }
`)

