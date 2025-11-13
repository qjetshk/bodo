import { gql } from "@apollo/client";

export interface FindMembersInput {
    member: {
        nickName?: string
        email?: string
    }

}

export interface FindMembersData {
    findMembers: {
        id: string;
        email: string;
        nickName: string;
        avatarUrl: string
    }[];
}

export const FIND_MEMBERS = gql`
    mutation FindMembers($member: FindMemberInput!) {
        findMembers(member: $member) {
            id
            email
            nickName
            avatarUrl
        }
    }
`