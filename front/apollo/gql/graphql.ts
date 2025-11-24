/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type AcceptedOrDeclinedInvitation = {
  __typename?: 'AcceptedOrDeclinedInvitation';
  boardId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invitedById: Scalars['String']['output'];
  member: BoardMember;
};

export type Board = {
  __typename?: 'Board';
  boardTemplate?: Maybe<BoardTemplate>;
  boardTemplateId?: Maybe<Scalars['String']['output']>;
  boardType: Scalars['Boolean']['output'];
  columns: Array<Column>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<BoardMember>;
  name: Scalars['String']['output'];
  owner: User;
  ownerId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BoardEdited = {
  __typename?: 'BoardEdited';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<User>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BoardInvitation = {
  __typename?: 'BoardInvitation';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  invitedBy: User;
  invitedById: Scalars['String']['output'];
  status: InvitationStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type BoardMember = {
  __typename?: 'BoardMember';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type BoardTemplate = {
  __typename?: 'BoardTemplate';
  boards: Array<Board>;
  columns: Array<ColumnTemplate>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeColumnOrderInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

export type ChangedColumn = {
  __typename?: 'ChangedColumn';
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
};

export type ChangedColumnsOrder = {
  __typename?: 'ChangedColumnsOrder';
  boardId: Scalars['ID']['output'];
  columns: Array<ChangedColumn>;
};

export type Column = {
  __typename?: 'Column';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  tasks: Array<Task>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ColumnTemplate = {
  __typename?: 'ColumnTemplate';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  template: BoardTemplate;
  templateId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  authorId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  task: Task;
  taskId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateBoardInput = {
  boardTemplateId: Scalars['String']['input'];
  boardType: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  membersToAdd?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type CreateTaskInput = {
  columnId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreatedTask = {
  __typename?: 'CreatedTask';
  columnId: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DeletedTask = {
  __typename?: 'DeletedTask';
  boardUpdatedAt: Scalars['DateTime']['output'];
  columnId: Scalars['String']['output'];
  tasks: Array<CreatedTask>;
};

export type EditBoardInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  membersToAdd?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type FindMemberInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  nickName?: InputMaybe<Scalars['String']['input']>;
};

export enum InvitationStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Board;
  changeColumnTitle: Scalars['Boolean']['output'];
  changeColumnsOrder: Scalars['Boolean']['output'];
  createBoard: Board;
  createTask: Scalars['Boolean']['output'];
  declineInvitation: Scalars['Boolean']['output'];
  deleteTask: Scalars['Boolean']['output'];
  editBoard?: Maybe<UpdatedBoard>;
  findMembers: Array<User>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationChangeColumnTitleArgs = {
  columnId: Scalars['String']['input'];
  newTitle: Scalars['String']['input'];
};


export type MutationChangeColumnsOrderArgs = {
  boardId: Scalars['ID']['input'];
  changeColumnInput: Array<ChangeColumnOrderInput>;
};


export type MutationCreateBoardArgs = {
  boardInput: CreateBoardInput;
};


export type MutationCreateTaskArgs = {
  taskInput: CreateTaskInput;
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type MutationEditBoardArgs = {
  boardId: Scalars['String']['input'];
  editBoardInput: EditBoardInput;
};


export type MutationFindMembersArgs = {
  member: FindMemberInput;
};

export type Query = {
  __typename?: 'Query';
  getAllBoardTemplates: Array<BoardTemplate>;
  getAllUserBoardInvitation: Array<BoardInvitation>;
  getAllUserBoards: Array<Board>;
  getAllUserInvations: Array<BoardInvitation>;
  getBoardById: Board;
  hello: Scalars['String']['output'];
};


export type QueryGetBoardByIdArgs = {
  boardId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  boardEdited: BoardEdited;
  columnOrderChanged: ChangedColumnsOrder;
  columnTitleChanged: UpdatedColumn;
  invitationAccepted: AcceptedOrDeclinedInvitation;
  invitationCreated: BoardInvitation;
  invitationDeclined: AcceptedOrDeclinedInvitation;
  taskCreated: CreatedTask;
  taskDeleted: DeletedTask;
};

export type Task = {
  __typename?: 'Task';
  assignments?: Maybe<Array<TaskAssignment>>;
  column: Column;
  columnId: Scalars['String']['output'];
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TaskAssignment = {
  __typename?: 'TaskAssignment';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  task: Task;
  taskId: Scalars['String']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type UpdatedBoard = {
  __typename?: 'UpdatedBoard';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdatedColumn = {
  __typename?: 'UpdatedColumn';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nickName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetAllUserBoardsForNavigationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardsForNavigationQuery = { __typename?: 'Query', getAllUserBoards: Array<{ __typename?: 'Board', id: string, name: string, description?: string | null, createdAt: any }> };

export type GetAllUserBoardsForDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardsForDashboardQuery = { __typename?: 'Query', getAllUserBoards: Array<{ __typename?: 'Board', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any, owner: { __typename?: 'User', email: string, nickName: string, avatarUrl?: string | null }, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, nickName: string } }> }> };

export type CreateBoardMutationVariables = Exact<{
  boardInput: CreateBoardInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'Board', id: string } };

export type GetInitialBoardQueryVariables = Exact<{
  boardId: Scalars['String']['input'];
}>;


export type GetInitialBoardQuery = { __typename?: 'Query', getBoardById: { __typename?: 'Board', boardType: boolean, name: string, description?: string | null, id: string, createdAt: any, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string } }>, owner: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string }, columns: Array<{ __typename?: 'Column', id: string, order: number, title: string, tasks: Array<{ __typename?: 'Task', description: string, id: string, order: number, title: string, updatedAt: any, columnId: string }> }> } };

export type EditBoardMutationVariables = Exact<{
  boardId: Scalars['String']['input'];
  editBoardInput: EditBoardInput;
}>;


export type EditBoardMutation = { __typename?: 'Mutation', editBoard?: { __typename?: 'UpdatedBoard', id: string, name?: string | null, description?: string | null, updatedAt: any } | null };

export type ChangeColumnTitleMutationVariables = Exact<{
  newTitle: Scalars['String']['input'];
  columnId: Scalars['String']['input'];
}>;


export type ChangeColumnTitleMutation = { __typename?: 'Mutation', changeColumnTitle: boolean };

export type ColumnTitleChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ColumnTitleChangedSubscription = { __typename?: 'Subscription', columnTitleChanged: { __typename?: 'UpdatedColumn', id: string, title: string } };

export type ChangeColumnsOrderMutationVariables = Exact<{
  changeColumnInput: Array<ChangeColumnOrderInput> | ChangeColumnOrderInput;
  boardId: Scalars['ID']['input'];
}>;


export type ChangeColumnsOrderMutation = { __typename?: 'Mutation', changeColumnsOrder: boolean };

export type ColumnOrderChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ColumnOrderChangedSubscription = { __typename?: 'Subscription', columnOrderChanged: { __typename?: 'ChangedColumnsOrder', boardId: string, columns: Array<{ __typename?: 'ChangedColumn', id: string, order: number }> } };

export type BoardEditedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BoardEditedSubscription = { __typename?: 'Subscription', boardEdited: { __typename?: 'BoardEdited', description?: string | null, id: string, name?: string | null, updatedAt: any } };

export type GetAllUserBoardInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardInvitationQuery = { __typename?: 'Query', getAllUserBoardInvitation: Array<{ __typename?: 'BoardInvitation', id: string, createdAt: any, board: { __typename?: 'Board', name: string }, invitedBy: { __typename?: 'User', email: string, nickName: string, avatarUrl?: string | null } }> };

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'Board', id: string } };

export type DeclineInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type DeclineInvitationMutation = { __typename?: 'Mutation', declineInvitation: boolean };

export type GetBoardInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetBoardInvitationSubscription = { __typename?: 'Subscription', invitationCreated: { __typename?: 'BoardInvitation', board: { __typename?: 'Board', name: string }, invitedBy: { __typename?: 'User', nickName: string } } };

export type UserAcceptInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserAcceptInvitationSubscription = { __typename?: 'Subscription', invitationAccepted: { __typename?: 'AcceptedOrDeclinedInvitation', id: string, invitedById: string, boardId: string, member: { __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, id: string, nickName: string } } } };

export type UserDeclineInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserDeclineInvitationSubscription = { __typename?: 'Subscription', invitationDeclined: { __typename?: 'AcceptedOrDeclinedInvitation', id: string, invitedById: string, boardId: string, member: { __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, id: string, nickName: string } } } };

export type FindMembersMutationVariables = Exact<{
  member: FindMemberInput;
}>;


export type FindMembersMutation = { __typename?: 'Mutation', findMembers: Array<{ __typename?: 'User', id: string, email: string, nickName: string, avatarUrl?: string | null }> };

export type CreateTaskMutationVariables = Exact<{
  taskInput: CreateTaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: boolean };

export type TaskCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TaskCreatedSubscription = { __typename?: 'Subscription', taskCreated: { __typename?: 'CreatedTask', columnId: string, description: string, id: string, order: number, title: string, updatedAt: any } };

export type DeleteTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: boolean };

export type TaskDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TaskDeletedSubscription = { __typename?: 'Subscription', taskDeleted: { __typename?: 'DeletedTask', columnId: string, boardUpdatedAt: any, tasks: Array<{ __typename?: 'CreatedTask', updatedAt: any, description: string, id: string, order: number, title: string }> } };

export type GetAllBoardTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBoardTemplatesQuery = { __typename?: 'Query', getAllBoardTemplates: Array<{ __typename?: 'BoardTemplate', id: string, name: string, description?: string | null, columns: Array<{ __typename?: 'ColumnTemplate', title: string, order: number }> }> };


export const GetAllUserBoardsForNavigationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardsForNavigation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardsForNavigationQuery, GetAllUserBoardsForNavigationQueryVariables>;
export const GetAllUserBoardsForDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardsForDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardsForDashboardQuery, GetAllUserBoardsForDashboardQueryVariables>;
export const CreateBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateBoardMutation, CreateBoardMutationVariables>;
export const GetInitialBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBoardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"columnId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialBoardQuery, GetInitialBoardQueryVariables>;
export const EditBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"editBoardInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"editBoardInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"editBoardInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<EditBoardMutation, EditBoardMutationVariables>;
export const ChangeColumnTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeColumnTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newTitle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"columnId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeColumnTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newTitle"}}},{"kind":"Argument","name":{"kind":"Name","value":"columnId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"columnId"}}}]}]}}]} as unknown as DocumentNode<ChangeColumnTitleMutation, ChangeColumnTitleMutationVariables>;
export const ColumnTitleChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ColumnTitleChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columnTitleChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<ColumnTitleChangedSubscription, ColumnTitleChangedSubscriptionVariables>;
export const ChangeColumnsOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeColumnsOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changeColumnInput"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeColumnOrderInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeColumnsOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"changeColumnInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changeColumnInput"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}]}]}}]} as unknown as DocumentNode<ChangeColumnsOrderMutation, ChangeColumnsOrderMutationVariables>;
export const ColumnOrderChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ColumnOrderChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columnOrderChanged"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardId"}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<ColumnOrderChangedSubscription, ColumnOrderChangedSubscriptionVariables>;
export const BoardEditedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"BoardEdited"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardEdited"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<BoardEditedSubscription, BoardEditedSubscriptionVariables>;
export const GetAllUserBoardInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoardInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardInvitationQuery, GetAllUserBoardInvitationQueryVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const DeclineInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}]}]}}]} as unknown as DocumentNode<DeclineInvitationMutation, DeclineInvitationMutationVariables>;
export const GetBoardInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GetBoardInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitationCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nickName"}}]}}]}}]}}]} as unknown as DocumentNode<GetBoardInvitationSubscription, GetBoardInvitationSubscriptionVariables>;
export const UserAcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserAcceptInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitationAccepted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invitedById"}},{"kind":"Field","name":{"kind":"Name","value":"boardId"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserAcceptInvitationSubscription, UserAcceptInvitationSubscriptionVariables>;
export const UserDeclineInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserDeclineInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitationDeclined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invitedById"}},{"kind":"Field","name":{"kind":"Name","value":"boardId"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserDeclineInvitationSubscription, UserDeclineInvitationSubscriptionVariables>;
export const FindMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FindMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"member"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"member"},"value":{"kind":"Variable","name":{"kind":"Name","value":"member"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<FindMembersMutation, FindMembersMutationVariables>;
export const CreateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskInput"}}}]}]}}]} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const TaskCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TaskCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columnId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<TaskCreatedSubscription, TaskCreatedSubscriptionVariables>;
export const DeleteTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}]}]}}]} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const TaskDeletedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TaskDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columnId"}},{"kind":"Field","name":{"kind":"Name","value":"boardUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<TaskDeletedSubscription, TaskDeletedSubscriptionVariables>;
export const GetAllBoardTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBoardTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllBoardTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllBoardTemplatesQuery, GetAllBoardTemplatesQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type AcceptedOrDeclinedInvitation = {
  __typename?: 'AcceptedOrDeclinedInvitation';
  boardId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invitedById: Scalars['String']['output'];
  member: BoardMember;
};

export type Board = {
  __typename?: 'Board';
  boardTemplate?: Maybe<BoardTemplate>;
  boardTemplateId?: Maybe<Scalars['String']['output']>;
  boardType: Scalars['Boolean']['output'];
  columns: Array<Column>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<BoardMember>;
  name: Scalars['String']['output'];
  owner: User;
  ownerId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BoardEdited = {
  __typename?: 'BoardEdited';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<User>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BoardInvitation = {
  __typename?: 'BoardInvitation';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  invitedBy: User;
  invitedById: Scalars['String']['output'];
  status: InvitationStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type BoardMember = {
  __typename?: 'BoardMember';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type BoardTemplate = {
  __typename?: 'BoardTemplate';
  boards: Array<Board>;
  columns: Array<ColumnTemplate>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeColumnOrderInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

export type ChangedColumn = {
  __typename?: 'ChangedColumn';
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
};

export type ChangedColumnsOrder = {
  __typename?: 'ChangedColumnsOrder';
  boardId: Scalars['ID']['output'];
  columns: Array<ChangedColumn>;
};

export type Column = {
  __typename?: 'Column';
  board: Board;
  boardId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  tasks: Array<Task>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ColumnTemplate = {
  __typename?: 'ColumnTemplate';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  template: BoardTemplate;
  templateId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  authorId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  task: Task;
  taskId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateBoardInput = {
  boardTemplateId: Scalars['String']['input'];
  boardType: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  membersToAdd?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type CreateTaskInput = {
  columnId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreatedTask = {
  __typename?: 'CreatedTask';
  columnId: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type DeletedTask = {
  __typename?: 'DeletedTask';
  boardUpdatedAt: Scalars['DateTime']['output'];
  columnId: Scalars['String']['output'];
  tasks: Array<CreatedTask>;
};

export type EditBoardInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  membersToAdd?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
};

export type FindMemberInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  nickName?: InputMaybe<Scalars['String']['input']>;
};

export enum InvitationStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Board;
  changeColumnTitle: Scalars['Boolean']['output'];
  changeColumnsOrder: Scalars['Boolean']['output'];
  createBoard: Board;
  createTask: Scalars['Boolean']['output'];
  declineInvitation: Scalars['Boolean']['output'];
  deleteTask: Scalars['Boolean']['output'];
  editBoard?: Maybe<UpdatedBoard>;
  findMembers: Array<User>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationChangeColumnTitleArgs = {
  columnId: Scalars['String']['input'];
  newTitle: Scalars['String']['input'];
};


export type MutationChangeColumnsOrderArgs = {
  boardId: Scalars['ID']['input'];
  changeColumnInput: Array<ChangeColumnOrderInput>;
};


export type MutationCreateBoardArgs = {
  boardInput: CreateBoardInput;
};


export type MutationCreateTaskArgs = {
  taskInput: CreateTaskInput;
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type MutationEditBoardArgs = {
  boardId: Scalars['String']['input'];
  editBoardInput: EditBoardInput;
};


export type MutationFindMembersArgs = {
  member: FindMemberInput;
};

export type Query = {
  __typename?: 'Query';
  getAllBoardTemplates: Array<BoardTemplate>;
  getAllUserBoardInvitation: Array<BoardInvitation>;
  getAllUserBoards: Array<Board>;
  getAllUserInvations: Array<BoardInvitation>;
  getBoardById: Board;
  hello: Scalars['String']['output'];
};


export type QueryGetBoardByIdArgs = {
  boardId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  boardEdited: BoardEdited;
  columnOrderChanged: ChangedColumnsOrder;
  columnTitleChanged: UpdatedColumn;
  invitationAccepted: AcceptedOrDeclinedInvitation;
  invitationCreated: BoardInvitation;
  invitationDeclined: AcceptedOrDeclinedInvitation;
  taskCreated: CreatedTask;
  taskDeleted: DeletedTask;
};

export type Task = {
  __typename?: 'Task';
  assignments?: Maybe<Array<TaskAssignment>>;
  column: Column;
  columnId: Scalars['String']['output'];
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TaskAssignment = {
  __typename?: 'TaskAssignment';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  task: Task;
  taskId: Scalars['String']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type UpdatedBoard = {
  __typename?: 'UpdatedBoard';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdatedColumn = {
  __typename?: 'UpdatedColumn';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nickName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetAllUserBoardsForNavigationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardsForNavigationQuery = { __typename?: 'Query', getAllUserBoards: Array<{ __typename?: 'Board', id: string, name: string, description?: string | null, createdAt: any }> };

export type GetAllUserBoardsForDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardsForDashboardQuery = { __typename?: 'Query', getAllUserBoards: Array<{ __typename?: 'Board', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any, owner: { __typename?: 'User', email: string, nickName: string, avatarUrl?: string | null }, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, nickName: string } }> }> };

export type CreateBoardMutationVariables = Exact<{
  boardInput: CreateBoardInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'Board', id: string } };

export type GetInitialBoardQueryVariables = Exact<{
  boardId: Scalars['String']['input'];
}>;


export type GetInitialBoardQuery = { __typename?: 'Query', getBoardById: { __typename?: 'Board', boardType: boolean, name: string, description?: string | null, id: string, createdAt: any, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string } }>, owner: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string }, columns: Array<{ __typename?: 'Column', id: string, order: number, title: string, tasks: Array<{ __typename?: 'Task', description: string, id: string, order: number, title: string, updatedAt: any, columnId: string }> }> } };

export type EditBoardMutationVariables = Exact<{
  boardId: Scalars['String']['input'];
  editBoardInput: EditBoardInput;
}>;


export type EditBoardMutation = { __typename?: 'Mutation', editBoard?: { __typename?: 'UpdatedBoard', id: string, name?: string | null, description?: string | null, updatedAt: any } | null };

export type ChangeColumnTitleMutationVariables = Exact<{
  newTitle: Scalars['String']['input'];
  columnId: Scalars['String']['input'];
}>;


export type ChangeColumnTitleMutation = { __typename?: 'Mutation', changeColumnTitle: boolean };

export type ColumnTitleChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ColumnTitleChangedSubscription = { __typename?: 'Subscription', columnTitleChanged: { __typename?: 'UpdatedColumn', id: string, title: string } };

export type ChangeColumnsOrderMutationVariables = Exact<{
  changeColumnInput: Array<ChangeColumnOrderInput> | ChangeColumnOrderInput;
  boardId: Scalars['ID']['input'];
}>;


export type ChangeColumnsOrderMutation = { __typename?: 'Mutation', changeColumnsOrder: boolean };

export type ColumnOrderChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ColumnOrderChangedSubscription = { __typename?: 'Subscription', columnOrderChanged: { __typename?: 'ChangedColumnsOrder', boardId: string, columns: Array<{ __typename?: 'ChangedColumn', id: string, order: number }> } };

export type BoardEditedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BoardEditedSubscription = { __typename?: 'Subscription', boardEdited: { __typename?: 'BoardEdited', description?: string | null, id: string, name?: string | null, updatedAt: any } };

export type GetAllUserBoardInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserBoardInvitationQuery = { __typename?: 'Query', getAllUserBoardInvitation: Array<{ __typename?: 'BoardInvitation', id: string, createdAt: any, board: { __typename?: 'Board', name: string }, invitedBy: { __typename?: 'User', email: string, nickName: string, avatarUrl?: string | null } }> };

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'Board', id: string } };

export type DeclineInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type DeclineInvitationMutation = { __typename?: 'Mutation', declineInvitation: boolean };

export type GetBoardInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetBoardInvitationSubscription = { __typename?: 'Subscription', invitationCreated: { __typename?: 'BoardInvitation', board: { __typename?: 'Board', name: string }, invitedBy: { __typename?: 'User', nickName: string } } };

export type UserAcceptInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserAcceptInvitationSubscription = { __typename?: 'Subscription', invitationAccepted: { __typename?: 'AcceptedOrDeclinedInvitation', id: string, invitedById: string, boardId: string, member: { __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, id: string, nickName: string } } } };

export type UserDeclineInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserDeclineInvitationSubscription = { __typename?: 'Subscription', invitationDeclined: { __typename?: 'AcceptedOrDeclinedInvitation', id: string, invitedById: string, boardId: string, member: { __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, id: string, nickName: string } } } };

export type FindMembersMutationVariables = Exact<{
  member: FindMemberInput;
}>;


export type FindMembersMutation = { __typename?: 'Mutation', findMembers: Array<{ __typename?: 'User', id: string, email: string, nickName: string, avatarUrl?: string | null }> };

export type CreateTaskMutationVariables = Exact<{
  taskInput: CreateTaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: boolean };

export type TaskCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TaskCreatedSubscription = { __typename?: 'Subscription', taskCreated: { __typename?: 'CreatedTask', columnId: string, description: string, id: string, order: number, title: string, updatedAt: any } };

export type DeleteTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: boolean };

export type TaskDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TaskDeletedSubscription = { __typename?: 'Subscription', taskDeleted: { __typename?: 'DeletedTask', columnId: string, boardUpdatedAt: any, tasks: Array<{ __typename?: 'CreatedTask', updatedAt: any, description: string, id: string, order: number, title: string }> } };

export type GetAllBoardTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBoardTemplatesQuery = { __typename?: 'Query', getAllBoardTemplates: Array<{ __typename?: 'BoardTemplate', id: string, name: string, description?: string | null, columns: Array<{ __typename?: 'ColumnTemplate', title: string, order: number }> }> };
