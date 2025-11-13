import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  boardType: boolean; // false - public, true - private

  @Field(() => String)
  boardTemplateId: string;

  @Field(() => [String], { nullable: true })
  membersToAdd?: string[];
}
