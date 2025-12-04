import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChangeTaskOrderInput {
    @Field()
    id: string

    @Field()
    order: number

    @Field({nullable: true})
    columnId?: string
}