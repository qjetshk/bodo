import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddNewColumnInput {
    @Field()
    boardId: string

    @Field()
    title: string

}