import { graphql } from "../gql";


export const FIND_MEMBERS = graphql(`
    mutation FindMembers($member: FindMemberInput!) {
        findMembers(member: $member) {
            id
            email
            nickName
            avatarUrl
        }
    }
`)