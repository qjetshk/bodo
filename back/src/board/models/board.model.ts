import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BoardMember } from './board-member.model';
import { Column } from './column.model';
import { BoardTemplate } from 'src/template/models/board-template.model';
import { User } from 'src/users (members)/models/user.model';

@ObjectType()
export class Board {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  boardType: boolean; // false - public, true - private

  @Field(() => User)
  owner: User;

  @Field()
  ownerId: string;

  @Field(() => [BoardMember])
  members: BoardMember[];

  @Field(() => [Column])
  columns: Column[];

  @Field(() => BoardTemplate, { nullable: true })
  boardTemplate?: BoardTemplate;

  @Field({ nullable: true })
  boardTemplateId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/* src 
    board 
        models 
            board-member.model.ts 
            board.model.ts 
        board.module.ts
        board.service.ts 
        board.resolver.ts
    task
        models
            comment.model.ts 
            task-assignment.model.ts
            task.model.ts 
        task.module.ts
        task.service.ts 
        task.resolver.ts
    template
        models
            board-template.model.ts
            column-template.model.ts
        template.module.ts
        template.service.ts 
        template.resolver.ts
    user
        models
            user.model.ts */
