import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Board } from "src/board/models/board.model";
import { User } from "./user.model";
import { DateTimeResolver } from 'graphql-scalars'

@ObjectType()
export class BoardInvitation {
  @Field()
  id: string;

  @Field(() => Board)
  board: Board;

  @Field()
  boardId: string;

  @Field(() => User)
  invitedBy: User;

  @Field()
  invitedById: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

registerEnumType(InvitationStatus, {
  name: 'InvitationStatus',
});