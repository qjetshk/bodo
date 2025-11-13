import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  nickName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
