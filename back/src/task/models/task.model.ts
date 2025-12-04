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

  @Field()
  description: string;

  @Field(() => Int)
  order: number;

  @Field(() => Column)
  column: Column;

  @Field()
  columnId: string;

  @Field(() => [TaskAssignment], { nullable: true })
  assignments?: TaskAssignment[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}

@ObjectType()
export class CreatedTask {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int)
  order: number;

  @Field()
  columnId: string;

  @Field(() => DateTimeResolver)
  updatedAt: Date
}


@ObjectType()
export class DeletedTask {
  @Field()
  columnId: string

  @Field(() => DateTimeResolver)
  boardUpdatedAt: Date

  @Field(() => [CreatedTask])
  tasks: CreatedTask[]
}

@ObjectType()
export class ChangedTaskOrder {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  order: number;

  @Field({nullable: true})
  columnId?: string
}


@ObjectType()
export class ChangedTasksOrderInColumn {
  @Field(() => ID)
  columnId: string;

  @Field(() => [ChangedTaskOrder])
  tasks: ChangedTaskOrder[];
}

@ObjectType()
export class TaskMovedToAnotherColumn {
  @Field(() => ChangedTasksOrderInColumn)
  prevColumn: ChangedTasksOrderInColumn

  @Field(() => ChangedTasksOrderInColumn)
  currentColumn: ChangedTasksOrderInColumn
}

