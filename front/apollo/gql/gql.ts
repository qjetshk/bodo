/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetAllUserBoardsForNavigation {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n        }\n    }\n": typeof types.GetAllUserBoardsForNavigationDocument,
    "\n    query GetAllUserBoardsForDashboard {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n            updatedAt\n            owner {\n                email\n                nickName\n                avatarUrl\n            }\n            members {\n                user {\n                    avatarUrl\n                    nickName\n                }\n            }\n        }\n    }\n": typeof types.GetAllUserBoardsForDashboardDocument,
    "\n    mutation CreateBoard($boardInput: CreateBoardInput!) {\n        createBoard(boardInput: $boardInput) {\n            id\n        }\n    }\n\n": typeof types.CreateBoardDocument,
    "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members{\n                user{\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner{\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                }\n            }\n        }\n    }\n": typeof types.GetInitialBoardDocument,
    "\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n": typeof types.GetAllUserBoardInvitationDocument,
    "\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n": typeof types.AcceptInvitationDocument,
    "\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n": typeof types.DeclineInvitationDocument,
    "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n": typeof types.FindMembersDocument,
    "\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n": typeof types.GetAllBoardTemplatesDocument,
};
const documents: Documents = {
    "\n    query GetAllUserBoardsForNavigation {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n        }\n    }\n": types.GetAllUserBoardsForNavigationDocument,
    "\n    query GetAllUserBoardsForDashboard {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n            updatedAt\n            owner {\n                email\n                nickName\n                avatarUrl\n            }\n            members {\n                user {\n                    avatarUrl\n                    nickName\n                }\n            }\n        }\n    }\n": types.GetAllUserBoardsForDashboardDocument,
    "\n    mutation CreateBoard($boardInput: CreateBoardInput!) {\n        createBoard(boardInput: $boardInput) {\n            id\n        }\n    }\n\n": types.CreateBoardDocument,
    "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members{\n                user{\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner{\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                }\n            }\n        }\n    }\n": types.GetInitialBoardDocument,
    "\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n": types.GetAllUserBoardInvitationDocument,
    "\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n": types.AcceptInvitationDocument,
    "\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n": types.DeclineInvitationDocument,
    "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n": types.FindMembersDocument,
    "\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n": types.GetAllBoardTemplatesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAllUserBoardsForNavigation {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n        }\n    }\n"): (typeof documents)["\n    query GetAllUserBoardsForNavigation {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAllUserBoardsForDashboard {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n            updatedAt\n            owner {\n                email\n                nickName\n                avatarUrl\n            }\n            members {\n                user {\n                    avatarUrl\n                    nickName\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetAllUserBoardsForDashboard {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n            updatedAt\n            owner {\n                email\n                nickName\n                avatarUrl\n            }\n            members {\n                user {\n                    avatarUrl\n                    nickName\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateBoard($boardInput: CreateBoardInput!) {\n        createBoard(boardInput: $boardInput) {\n            id\n        }\n    }\n\n"): (typeof documents)["\n    mutation CreateBoard($boardInput: CreateBoardInput!) {\n        createBoard(boardInput: $boardInput) {\n            id\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members{\n                user{\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner{\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members{\n                user{\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner{\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n"): (typeof documents)["\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n"): (typeof documents)["\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n"): (typeof documents)["\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n"): (typeof documents)["\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;