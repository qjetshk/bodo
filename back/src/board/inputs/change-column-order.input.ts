import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChangeColumnOrderInput {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number
}
