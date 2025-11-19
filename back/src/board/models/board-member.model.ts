import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Board } from './board.model';
import { User } from 'src/users (members)/models/user.model';
import { DateTimeResolver } from 'graphql-scalars';

@ObjectType()
export class BoardMember {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => Board)
  board: Board;

  @Field()
  boardId: string;

  @Field()
  role: string;

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}
