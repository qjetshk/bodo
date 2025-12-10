import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from './task.model';
import { User } from 'src/users (members)/models/user.model';
import { DateTimeResolver } from 'graphql-scalars';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User;

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}
