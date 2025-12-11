import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatedCommentinput {
    @Field()
    content: string

    @Field()
    authorId: string

    @Field()
    taskId: string
}