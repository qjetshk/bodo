import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatedCommentinput {
    @Field()
    content: string

    @Field()
    taskId: string
}