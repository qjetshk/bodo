import { graphql } from "@/shared/api/graphql/gql";


export const GET_ALL_USER_BOARD_INVITATIONS = graphql(`
    query GetAllUserBoardInvitation {
        getAllUserBoardInvitation {
            id
            createdAt
            board {
                name
            }
            invitedBy {
                email
                nickName
                avatarUrl
            }
        }
    }

`)

export const ACCEPT_INVITATION = graphql(`
    mutation AcceptInvitation($invitationId: String!) {
        acceptInvitation(invitationId: $invitationId) {
            id
        }
    }

`)

export const DECLINE_INVITATION = graphql(`
    mutation DeclineInvitation ($invitationId: String!){
        declineInvitation(invitationId: $invitationId)
    }
`)

export const GET_BOARD_INVITATION = graphql(`
    subscription GetBoardInvitation{
        invitationCreated{
            board{
                name
            }
            invitedBy{
                nickName
            }
        }
    }
`)

export const USER_ACCEPT_INVITATION = graphql(`
    subscription UserAcceptInvitation{
        invitationAccepted{
            id
            invitedById
            boardId
            member{
                user{
                    avatarUrl
                    email
                    id
                    nickName
                }
            }
        }
    }
`)

export const USER_DECLINE_INVITATION = graphql(`
    subscription UserDeclineInvitation{
        invitationDeclined{
            id
            invitedById
            boardId
            member{
                user{
                    avatarUrl
                    email
                    id
                    nickName
                }
            }
        }
    }
`)