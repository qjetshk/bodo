import { Field, ID, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { DateTimeResolver } from "graphql-scalars";
import { TaskAssignment } from "../models/task-assignment.model";
import { Column } from "src/board/models/column.model";

@InputType()
export class CreateTaskInput {

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], {nullable: true})
  membersIds?: string[]

  @Field(() => DateTimeResolver)
  deadlineDate: Date

  @Field(() => Priorities)
  priority: Priorities

  @Field()
  columnId: string;

}

export enum Priorities {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

registerEnumType(Priorities, {
  name: 'Priorities',
});