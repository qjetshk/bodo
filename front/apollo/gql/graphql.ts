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
  createBoard: Board;
  declineInvitation: Scalars['Boolean']['output'];
  findMembers: Array<User>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationCreateBoardArgs = {
  boardInput: CreateBoardInput;
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['String']['input'];
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
  invitationCreated: BoardInvitation;
};

export type Task = {
  __typename?: 'Task';
  assignments: Array<TaskAssignment>;
  column: Column;
  columnId: Scalars['String']['output'];
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
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


export type GetInitialBoardQuery = { __typename?: 'Query', getBoardById: { __typename?: 'Board', boardType: boolean, name: string, description?: string | null, id: string, createdAt: any, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string } }>, owner: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string }, columns: Array<{ __typename?: 'Column', id: string, order: number, title: string, tasks: Array<{ __typename?: 'Task', description?: string | null, id: string, order: number, title: string, updatedAt: any }> }> } };

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

export type FindMembersMutationVariables = Exact<{
  member: FindMemberInput;
}>;


export type FindMembersMutation = { __typename?: 'Mutation', findMembers: Array<{ __typename?: 'User', id: string, email: string, nickName: string, avatarUrl?: string | null }> };

export type GetAllBoardTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBoardTemplatesQuery = { __typename?: 'Query', getAllBoardTemplates: Array<{ __typename?: 'BoardTemplate', id: string, name: string, description?: string | null, columns: Array<{ __typename?: 'ColumnTemplate', title: string, order: number }> }> };


export const GetAllUserBoardsForNavigationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardsForNavigation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardsForNavigationQuery, GetAllUserBoardsForNavigationQueryVariables>;
export const GetAllUserBoardsForDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardsForDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardsForDashboardQuery, GetAllUserBoardsForDashboardQueryVariables>;
export const CreateBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateBoardMutation, CreateBoardMutationVariables>;
export const GetInitialBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitialBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBoardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetInitialBoardQuery, GetInitialBoardQueryVariables>;
export const GetAllUserBoardInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserBoardInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUserBoardInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUserBoardInvitationQuery, GetAllUserBoardInvitationQueryVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const DeclineInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitationId"}}}]}]}}]} as unknown as DocumentNode<DeclineInvitationMutation, DeclineInvitationMutationVariables>;
export const FindMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FindMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"member"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"member"},"value":{"kind":"Variable","name":{"kind":"Name","value":"member"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<FindMembersMutation, FindMembersMutationVariables>;
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
  createBoard: Board;
  declineInvitation: Scalars['Boolean']['output'];
  findMembers: Array<User>;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationCreateBoardArgs = {
  boardInput: CreateBoardInput;
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['String']['input'];
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
  invitationCreated: BoardInvitation;
};

export type Task = {
  __typename?: 'Task';
  assignments: Array<TaskAssignment>;
  column: Column;
  columnId: Scalars['String']['output'];
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
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


export type GetInitialBoardQuery = { __typename?: 'Query', getBoardById: { __typename?: 'Board', boardType: boolean, name: string, description?: string | null, id: string, createdAt: any, members: Array<{ __typename?: 'BoardMember', user: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string } }>, owner: { __typename?: 'User', avatarUrl?: string | null, email: string, nickName: string, id: string }, columns: Array<{ __typename?: 'Column', id: string, order: number, title: string, tasks: Array<{ __typename?: 'Task', description?: string | null, id: string, order: number, title: string, updatedAt: any }> }> } };

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

export type FindMembersMutationVariables = Exact<{
  member: FindMemberInput;
}>;


export type FindMembersMutation = { __typename?: 'Mutation', findMembers: Array<{ __typename?: 'User', id: string, email: string, nickName: string, avatarUrl?: string | null }> };

export type GetAllBoardTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBoardTemplatesQuery = { __typename?: 'Query', getAllBoardTemplates: Array<{ __typename?: 'BoardTemplate', id: string, name: string, description?: string | null, columns: Array<{ __typename?: 'ColumnTemplate', title: string, order: number }> }> };
