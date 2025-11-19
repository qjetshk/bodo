import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Column } from 'src/board/models/column.model';
import { TaskAssignment } from './task-assignment.model';
import { Comment } from './comment.model';
import { DateTimeResolver } from 'graphql-scalars';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  order: number;

  @Field(() => Column)
  column: Column;

  @Field()
  columnId: string;

  @Field(() => [TaskAssignment])
  assignments: TaskAssignment[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}
