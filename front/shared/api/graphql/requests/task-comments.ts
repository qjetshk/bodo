import { graphql } from "../gql";

export const CREATE_COMMENT = graphql(`
    mutation CreateComment($commentInput: CreatedCommentinput!) {
        createComment(commentInput: $commentInput)
    }
`)

export const EDIT_COMMENT = graphql(`
    mutation EditComment($commentInput: EditCommentinput!) {
        editComment(commentInput: $commentInput)
    }
`)

export const DELETE_COMMENT = graphql(`
    mutation DeleteComment($commentId: String!) {
        deleteComment(commentId: $commentId)
    }
`)
