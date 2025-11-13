import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindMemberInput {
  @Field({ nullable: true })
  nickName?: string;

  @Field({ nullable: true })
  email?: string;
}
