import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EditCommentinput {
    @Field()
    content: string

    @Field()
    id: string
}