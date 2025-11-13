import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Board } from './board.model';
import { Task } from 'src/task/models/task.model';

@ObjectType()
export class Column {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  order: number;

  @Field(() => Board)
  board: Board;

  @Field()
  boardId: string;

  @Field(() => [Task])
  tasks: Task[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
