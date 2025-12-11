import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { DateTimeResolver } from "graphql-scalars";
import { Priorities } from "./create-task.input";

@InputType()
export class EditTaskInput {

    @Field()
    id: string

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [String], { nullable: true })
    membersIds?: string[]

    @Field(() => DateTimeResolver)
    deadlineDate: Date

    @Field(() => Priorities)
    priority: Priorities

}

registerEnumType(Priorities, {
    name: 'Priorities',
});