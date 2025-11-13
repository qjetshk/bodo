import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Board } from './board.model';
import { User } from 'src/users (members)/models/user.model';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
