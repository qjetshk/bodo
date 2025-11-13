import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Board } from 'src/board/models/board.model';
import { ColumnTemplate } from './column-template.model';


@ObjectType()
export class BoardTemplate {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [ColumnTemplate])
  columns: ColumnTemplate[];

  @Field(() => [Board])
  boards: Board[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
