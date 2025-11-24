import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { DateTimeResolver } from "graphql-scalars";
import { TaskAssignment } from "../models/task-assignment.model";
import { Column } from "src/board/models/column.model";

@InputType()
export class CreateTaskInput {

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  columnId: string;

}
