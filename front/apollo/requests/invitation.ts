import { graphql } from "../gql";


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