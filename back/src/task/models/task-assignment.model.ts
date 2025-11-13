import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from './task.model';
import { User } from 'src/users (members)/models/user.model';

@ObjectType()
export class TaskAssignment {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field(() => Task)
  task: Task;

  @Field()
  taskId: string;

  @Field()
  createdAt: Date;
}
