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
    "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members {\n                user {\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner {\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                    columnId\n                    priority\n                    deadlineDate\n                    assignments {\n                        user {\n                            avatarUrl\n                            email\n                            id\n                            nickName\n                        }\n                    }\n                    comments {\n                        content\n                        id\n                        updatedAt\n                        author {\n                            avatarUrl\n                            nickName\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInitialBoardDocument,
    "\n    mutation EditBoard($boardId: String!, $editBoardInput: EditBoardInput!) {\n        editBoard(editBoardInput: $editBoardInput, boardId: $boardId) {\n            id \n            name \n            description \n            updatedAt\n        }\n    }\n": typeof types.EditBoardDocument,
    "\n    subscription BoardEdited{\n        boardEdited{\n            description\n            id\n            name\n            updatedAt\n        }\n    }\n": typeof types.BoardEditedDocument,
    "\n    mutation DeleteBoard($boardId: String!){\n        deleteBoard(boardId: $boardId)\n    }\n": typeof types.DeleteBoardDocument,
    "\n    subscription BoardDeleted {\n        boardDeleted {\n            id\n            name\n        }\n    }\n": typeof types.BoardDeletedDocument,
    "\n    mutation ChangeColumnTitle($newTitle: String!, $columnId: String!){\n        changeColumnTitle(newTitle: $newTitle, columnId: $columnId)\n    }\n": typeof types.ChangeColumnTitleDocument,
    "\n    subscription ColumnTitleChanged{\n        columnTitleChanged{\n            id\n            title\n        }\n    }\n": typeof types.ColumnTitleChangedDocument,
    "\n  mutation ChangeColumnsOrder($changeColumnInput: [ChangeColumnOrderInput!]!, $boardId: ID!){\n    changeColumnsOrder(changeColumnInput: $changeColumnInput, boardId: $boardId)\n  }\n": typeof types.ChangeColumnsOrderDocument,
    "\n    subscription ColumnOrderChanged{\n        columnOrderChanged{\n            boardId\n            columns{\n                id\n                order\n            }\n        }\n    }\n\n": typeof types.ColumnOrderChangedDocument,
    "\n    mutation AddNewColumn($columnInput: AddNewColumnInput!){\n        addNewColumn(columnInput: $columnInput)\n    }   \n": typeof types.AddNewColumnDocument,
    "\n    subscription ColumnAdded {\n        columnAdded {\n            boardId\n            title\n            id\n            order\n        }\n    }\n\n": typeof types.ColumnAddedDocument,
    "\n    mutation DeleteColumn($columnId: String!){\n        deleteColumn(columnId: $columnId)\n    }\n": typeof types.DeleteColumnDocument,
    "\n    subscription ColumnDeleted {\n        columnDeleted {\n            columns {\n                id\n                order\n            }\n        }\n    }\n": typeof types.ColumnDeletedDocument,
    "\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n": typeof types.GetAllUserBoardInvitationDocument,
    "\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n": typeof types.AcceptInvitationDocument,
    "\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n": typeof types.DeclineInvitationDocument,
    "\n    subscription GetBoardInvitation{\n        invitationCreated{\n            board{\n                name\n            }\n            invitedBy{\n                nickName\n            }\n        }\n    }\n": typeof types.GetBoardInvitationDocument,
    "\n    subscription UserAcceptInvitation{\n        invitationAccepted{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": typeof types.UserAcceptInvitationDocument,
    "\n    subscription UserDeclineInvitation{\n        invitationDeclined{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": typeof types.UserDeclineInvitationDocument,
    "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n": typeof types.FindMembersDocument,
    "\n    mutation CreateTask($taskInput: CreateTaskInput!){\n        createTask(taskInput: $taskInput)\n    }\n": typeof types.CreateTaskDocument,
    "\n    subscription TaskCreated {\n        taskCreated {\n            columnId\n            description\n            id\n            order\n            title\n            updatedAt\n            deadlineDate\n            priority\n            comments {\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n                content\n                id\n                content\n            }\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": typeof types.TaskCreatedDocument,
    "\n    mutation EditTask($taskInput: EditTaskInput!){\n        editTask(taskInput: $taskInput)\n    }\n": typeof types.EditTaskDocument,
    "\n    subscription TaskEdited {\n        taskEdited {\n            description\n            id\n            order\n            title\n            updatedAt\n            columnId\n            priority\n            deadlineDate\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n            comments {\n                content\n                id\n                updatedAt\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n            }\n        }\n    }\n": typeof types.TaskEditedDocument,
    "\n    mutation DeleteTask($taskId: String!){\n        deleteTask(taskId: $taskId)\n    }\n": typeof types.DeleteTaskDocument,
    "\n    subscription TaskDeleted {\n        taskDeleted {\n            columnId\n            taskId\n        }\n    }\n": typeof types.TaskDeletedDocument,
    "\n    mutation ChangeTasksOrder(\n        $newTasks: [ChangeTaskOrderInput!]!\n        $columnId: String!\n    ) {\n        changeTasksOrder(newTasks: $newTasks, columnId: $columnId)\n    }\n": typeof types.ChangeTasksOrderDocument,
    "\n    subscription TasksOrderChangedInOneColumn {\n        tasksOrderChangedInOneColumn {\n            columnId\n            tasks {\n                id\n                order\n                columnId\n            }\n        }\n    }\n": typeof types.TasksOrderChangedInOneColumnDocument,
    "\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n": typeof types.GetAllBoardTemplatesDocument,
};
const documents: Documents = {
    "\n    query GetAllUserBoardsForNavigation {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n        }\n    }\n": types.GetAllUserBoardsForNavigationDocument,
    "\n    query GetAllUserBoardsForDashboard {\n        getAllUserBoards {\n            id\n            name\n            description\n            createdAt\n            updatedAt\n            owner {\n                email\n                nickName\n                avatarUrl\n            }\n            members {\n                user {\n                    avatarUrl\n                    nickName\n                }\n            }\n        }\n    }\n": types.GetAllUserBoardsForDashboardDocument,
    "\n    mutation CreateBoard($boardInput: CreateBoardInput!) {\n        createBoard(boardInput: $boardInput) {\n            id\n        }\n    }\n\n": types.CreateBoardDocument,
    "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members {\n                user {\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner {\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                    columnId\n                    priority\n                    deadlineDate\n                    assignments {\n                        user {\n                            avatarUrl\n                            email\n                            id\n                            nickName\n                        }\n                    }\n                    comments {\n                        content\n                        id\n                        updatedAt\n                        author {\n                            avatarUrl\n                            nickName\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n": types.GetInitialBoardDocument,
    "\n    mutation EditBoard($boardId: String!, $editBoardInput: EditBoardInput!) {\n        editBoard(editBoardInput: $editBoardInput, boardId: $boardId) {\n            id \n            name \n            description \n            updatedAt\n        }\n    }\n": types.EditBoardDocument,
    "\n    subscription BoardEdited{\n        boardEdited{\n            description\n            id\n            name\n            updatedAt\n        }\n    }\n": types.BoardEditedDocument,
    "\n    mutation DeleteBoard($boardId: String!){\n        deleteBoard(boardId: $boardId)\n    }\n": types.DeleteBoardDocument,
    "\n    subscription BoardDeleted {\n        boardDeleted {\n            id\n            name\n        }\n    }\n": types.BoardDeletedDocument,
    "\n    mutation ChangeColumnTitle($newTitle: String!, $columnId: String!){\n        changeColumnTitle(newTitle: $newTitle, columnId: $columnId)\n    }\n": types.ChangeColumnTitleDocument,
    "\n    subscription ColumnTitleChanged{\n        columnTitleChanged{\n            id\n            title\n        }\n    }\n": types.ColumnTitleChangedDocument,
    "\n  mutation ChangeColumnsOrder($changeColumnInput: [ChangeColumnOrderInput!]!, $boardId: ID!){\n    changeColumnsOrder(changeColumnInput: $changeColumnInput, boardId: $boardId)\n  }\n": types.ChangeColumnsOrderDocument,
    "\n    subscription ColumnOrderChanged{\n        columnOrderChanged{\n            boardId\n            columns{\n                id\n                order\n            }\n        }\n    }\n\n": types.ColumnOrderChangedDocument,
    "\n    mutation AddNewColumn($columnInput: AddNewColumnInput!){\n        addNewColumn(columnInput: $columnInput)\n    }   \n": types.AddNewColumnDocument,
    "\n    subscription ColumnAdded {\n        columnAdded {\n            boardId\n            title\n            id\n            order\n        }\n    }\n\n": types.ColumnAddedDocument,
    "\n    mutation DeleteColumn($columnId: String!){\n        deleteColumn(columnId: $columnId)\n    }\n": types.DeleteColumnDocument,
    "\n    subscription ColumnDeleted {\n        columnDeleted {\n            columns {\n                id\n                order\n            }\n        }\n    }\n": types.ColumnDeletedDocument,
    "\n    query GetAllUserBoardInvitation {\n        getAllUserBoardInvitation {\n            id\n            createdAt\n            board {\n                name\n            }\n            invitedBy {\n                email\n                nickName\n                avatarUrl\n            }\n        }\n    }\n\n": types.GetAllUserBoardInvitationDocument,
    "\n    mutation AcceptInvitation($invitationId: String!) {\n        acceptInvitation(invitationId: $invitationId) {\n            id\n        }\n    }\n\n": types.AcceptInvitationDocument,
    "\n    mutation DeclineInvitation ($invitationId: String!){\n        declineInvitation(invitationId: $invitationId)\n    }\n": types.DeclineInvitationDocument,
    "\n    subscription GetBoardInvitation{\n        invitationCreated{\n            board{\n                name\n            }\n            invitedBy{\n                nickName\n            }\n        }\n    }\n": types.GetBoardInvitationDocument,
    "\n    subscription UserAcceptInvitation{\n        invitationAccepted{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": types.UserAcceptInvitationDocument,
    "\n    subscription UserDeclineInvitation{\n        invitationDeclined{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": types.UserDeclineInvitationDocument,
    "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n": types.FindMembersDocument,
    "\n    mutation CreateTask($taskInput: CreateTaskInput!){\n        createTask(taskInput: $taskInput)\n    }\n": types.CreateTaskDocument,
    "\n    subscription TaskCreated {\n        taskCreated {\n            columnId\n            description\n            id\n            order\n            title\n            updatedAt\n            deadlineDate\n            priority\n            comments {\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n                content\n                id\n                content\n            }\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n": types.TaskCreatedDocument,
    "\n    mutation EditTask($taskInput: EditTaskInput!){\n        editTask(taskInput: $taskInput)\n    }\n": types.EditTaskDocument,
    "\n    subscription TaskEdited {\n        taskEdited {\n            description\n            id\n            order\n            title\n            updatedAt\n            columnId\n            priority\n            deadlineDate\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n            comments {\n                content\n                id\n                updatedAt\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n            }\n        }\n    }\n": types.TaskEditedDocument,
    "\n    mutation DeleteTask($taskId: String!){\n        deleteTask(taskId: $taskId)\n    }\n": types.DeleteTaskDocument,
    "\n    subscription TaskDeleted {\n        taskDeleted {\n            columnId\n            taskId\n        }\n    }\n": types.TaskDeletedDocument,
    "\n    mutation ChangeTasksOrder(\n        $newTasks: [ChangeTaskOrderInput!]!\n        $columnId: String!\n    ) {\n        changeTasksOrder(newTasks: $newTasks, columnId: $columnId)\n    }\n": types.ChangeTasksOrderDocument,
    "\n    subscription TasksOrderChangedInOneColumn {\n        tasksOrderChangedInOneColumn {\n            columnId\n            tasks {\n                id\n                order\n                columnId\n            }\n        }\n    }\n": types.TasksOrderChangedInOneColumnDocument,
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
export function graphql(source: "\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members {\n                user {\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner {\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                    columnId\n                    priority\n                    deadlineDate\n                    assignments {\n                        user {\n                            avatarUrl\n                            email\n                            id\n                            nickName\n                        }\n                    }\n                    comments {\n                        content\n                        id\n                        updatedAt\n                        author {\n                            avatarUrl\n                            nickName\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetInitialBoard($boardId: String!) {\n        getBoardById(boardId: $boardId) {\n            boardType\n            name\n            description\n            id\n            createdAt\n            members {\n                user {\n                    avatarUrl\n                    email\n                    nickName\n                    id\n                }\n            }\n            owner {\n                avatarUrl\n                email\n                nickName\n                id\n            }\n            columns {\n                id\n                order\n                title\n                tasks {\n                    description\n                    id\n                    order\n                    title\n                    updatedAt\n                    columnId\n                    priority\n                    deadlineDate\n                    assignments {\n                        user {\n                            avatarUrl\n                            email\n                            id\n                            nickName\n                        }\n                    }\n                    comments {\n                        content\n                        id\n                        updatedAt\n                        author {\n                            avatarUrl\n                            nickName\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation EditBoard($boardId: String!, $editBoardInput: EditBoardInput!) {\n        editBoard(editBoardInput: $editBoardInput, boardId: $boardId) {\n            id \n            name \n            description \n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    mutation EditBoard($boardId: String!, $editBoardInput: EditBoardInput!) {\n        editBoard(editBoardInput: $editBoardInput, boardId: $boardId) {\n            id \n            name \n            description \n            updatedAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription BoardEdited{\n        boardEdited{\n            description\n            id\n            name\n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    subscription BoardEdited{\n        boardEdited{\n            description\n            id\n            name\n            updatedAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteBoard($boardId: String!){\n        deleteBoard(boardId: $boardId)\n    }\n"): (typeof documents)["\n    mutation DeleteBoard($boardId: String!){\n        deleteBoard(boardId: $boardId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription BoardDeleted {\n        boardDeleted {\n            id\n            name\n        }\n    }\n"): (typeof documents)["\n    subscription BoardDeleted {\n        boardDeleted {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ChangeColumnTitle($newTitle: String!, $columnId: String!){\n        changeColumnTitle(newTitle: $newTitle, columnId: $columnId)\n    }\n"): (typeof documents)["\n    mutation ChangeColumnTitle($newTitle: String!, $columnId: String!){\n        changeColumnTitle(newTitle: $newTitle, columnId: $columnId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription ColumnTitleChanged{\n        columnTitleChanged{\n            id\n            title\n        }\n    }\n"): (typeof documents)["\n    subscription ColumnTitleChanged{\n        columnTitleChanged{\n            id\n            title\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeColumnsOrder($changeColumnInput: [ChangeColumnOrderInput!]!, $boardId: ID!){\n    changeColumnsOrder(changeColumnInput: $changeColumnInput, boardId: $boardId)\n  }\n"): (typeof documents)["\n  mutation ChangeColumnsOrder($changeColumnInput: [ChangeColumnOrderInput!]!, $boardId: ID!){\n    changeColumnsOrder(changeColumnInput: $changeColumnInput, boardId: $boardId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription ColumnOrderChanged{\n        columnOrderChanged{\n            boardId\n            columns{\n                id\n                order\n            }\n        }\n    }\n\n"): (typeof documents)["\n    subscription ColumnOrderChanged{\n        columnOrderChanged{\n            boardId\n            columns{\n                id\n                order\n            }\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddNewColumn($columnInput: AddNewColumnInput!){\n        addNewColumn(columnInput: $columnInput)\n    }   \n"): (typeof documents)["\n    mutation AddNewColumn($columnInput: AddNewColumnInput!){\n        addNewColumn(columnInput: $columnInput)\n    }   \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription ColumnAdded {\n        columnAdded {\n            boardId\n            title\n            id\n            order\n        }\n    }\n\n"): (typeof documents)["\n    subscription ColumnAdded {\n        columnAdded {\n            boardId\n            title\n            id\n            order\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteColumn($columnId: String!){\n        deleteColumn(columnId: $columnId)\n    }\n"): (typeof documents)["\n    mutation DeleteColumn($columnId: String!){\n        deleteColumn(columnId: $columnId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription ColumnDeleted {\n        columnDeleted {\n            columns {\n                id\n                order\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription ColumnDeleted {\n        columnDeleted {\n            columns {\n                id\n                order\n            }\n        }\n    }\n"];
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
export function graphql(source: "\n    subscription GetBoardInvitation{\n        invitationCreated{\n            board{\n                name\n            }\n            invitedBy{\n                nickName\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription GetBoardInvitation{\n        invitationCreated{\n            board{\n                name\n            }\n            invitedBy{\n                nickName\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription UserAcceptInvitation{\n        invitationAccepted{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription UserAcceptInvitation{\n        invitationAccepted{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription UserDeclineInvitation{\n        invitationDeclined{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription UserDeclineInvitation{\n        invitationDeclined{\n            id\n            invitedById\n            boardId\n            member{\n                user{\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n"): (typeof documents)["\n    mutation FindMembers($member: FindMemberInput!) {\n        findMembers(member: $member) {\n            id\n            email\n            nickName\n            avatarUrl\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateTask($taskInput: CreateTaskInput!){\n        createTask(taskInput: $taskInput)\n    }\n"): (typeof documents)["\n    mutation CreateTask($taskInput: CreateTaskInput!){\n        createTask(taskInput: $taskInput)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription TaskCreated {\n        taskCreated {\n            columnId\n            description\n            id\n            order\n            title\n            updatedAt\n            deadlineDate\n            priority\n            comments {\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n                content\n                id\n                content\n            }\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription TaskCreated {\n        taskCreated {\n            columnId\n            description\n            id\n            order\n            title\n            updatedAt\n            deadlineDate\n            priority\n            comments {\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n                content\n                id\n                content\n            }\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation EditTask($taskInput: EditTaskInput!){\n        editTask(taskInput: $taskInput)\n    }\n"): (typeof documents)["\n    mutation EditTask($taskInput: EditTaskInput!){\n        editTask(taskInput: $taskInput)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription TaskEdited {\n        taskEdited {\n            description\n            id\n            order\n            title\n            updatedAt\n            columnId\n            priority\n            deadlineDate\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n            comments {\n                content\n                id\n                updatedAt\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription TaskEdited {\n        taskEdited {\n            description\n            id\n            order\n            title\n            updatedAt\n            columnId\n            priority\n            deadlineDate\n            assignments {\n                user {\n                    avatarUrl\n                    email\n                    id\n                    nickName\n                }\n            }\n            comments {\n                content\n                id\n                updatedAt\n                author {\n                    avatarUrl\n                    nickName\n                    id\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteTask($taskId: String!){\n        deleteTask(taskId: $taskId)\n    }\n"): (typeof documents)["\n    mutation DeleteTask($taskId: String!){\n        deleteTask(taskId: $taskId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription TaskDeleted {\n        taskDeleted {\n            columnId\n            taskId\n        }\n    }\n"): (typeof documents)["\n    subscription TaskDeleted {\n        taskDeleted {\n            columnId\n            taskId\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ChangeTasksOrder(\n        $newTasks: [ChangeTaskOrderInput!]!\n        $columnId: String!\n    ) {\n        changeTasksOrder(newTasks: $newTasks, columnId: $columnId)\n    }\n"): (typeof documents)["\n    mutation ChangeTasksOrder(\n        $newTasks: [ChangeTaskOrderInput!]!\n        $columnId: String!\n    ) {\n        changeTasksOrder(newTasks: $newTasks, columnId: $columnId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription TasksOrderChangedInOneColumn {\n        tasksOrderChangedInOneColumn {\n            columnId\n            tasks {\n                id\n                order\n                columnId\n            }\n        }\n    }\n"): (typeof documents)["\n    subscription TasksOrderChangedInOneColumn {\n        tasksOrderChangedInOneColumn {\n            columnId\n            tasks {\n                id\n                order\n                columnId\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllBoardTemplates {\n    getAllBoardTemplates {\n      id\n      name\n      description\n      columns {\n        title\n        order\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;