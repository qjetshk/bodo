import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EditBoardInput {
    @Field(() => String)
    name: string

    @Field(() => String, {nullable: true})
    description?: string

    @Field(() => [String], { nullable: true })
    membersToAdd?: string[];
}