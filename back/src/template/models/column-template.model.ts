import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { BoardTemplate } from './board-template.model';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
