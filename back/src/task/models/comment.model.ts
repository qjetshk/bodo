import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from './task.model';
import { User } from 'src/users (members)/models/user.model';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User;

  @Field()
  authorId: string;

  @Field(() => Task)
  task: Task;

  @Field()
  taskId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
