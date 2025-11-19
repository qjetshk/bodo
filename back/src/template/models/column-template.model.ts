import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { BoardTemplate } from './board-template.model';
import { DateTimeResolver } from 'graphql-scalars';

@ObjectType()
export class ColumnTemplate {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  order: number;

  @Field(() => BoardTemplate)
  template: BoardTemplate;

  @Field()
  templateId: string;

  @Field(() => DateTimeResolver)
  createdAt: Date;

  @Field(() => DateTimeResolver)
  updatedAt: Date;
}
