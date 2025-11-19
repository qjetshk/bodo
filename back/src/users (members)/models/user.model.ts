import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateTimeResolver } from 'graphql-scalars';

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

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
} 
