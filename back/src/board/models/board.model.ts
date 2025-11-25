import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BoardMember } from './board-member.model';
import { Column } from './column.model';
import { BoardTemplate } from 'src/template/models/board-template.model';
import { User } from 'src/users (members)/models/user.model';
import { DateTimeResolver } from 'graphql-scalars';

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

    @Field(() => DateTimeResolver)
    createdAt: Date;

    @Field(() => DateTimeResolver)
    updatedAt: Date;
}

@ObjectType()
export class UpdatedBoard {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => DateTimeResolver)
    updatedAt: Date;
}

@ObjectType()
export class BoardEdited {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [User])
    members: User[]

    @Field(() => DateTimeResolver)
    updatedAt: Date;
}


@ObjectType()
export class BoardDeleted {
    @Field()
    id: string;

    @Field()
    name: string
}


