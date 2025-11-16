import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { FindMemberInput } from './inputs/find-member.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Request } from 'express';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => [User])
  @UseGuards(GqlAuthGuard) 
  async findMembers(
    @CurrentUserId() id: string,
    @Context() ctx,
    @Args('member') input: FindMemberInput
  ) {
    const cookies = ctx.req.cookies
    console.log(cookies)
    console.log(input)
    const members = await this.usersService.findMembers(input, id);
    return members;
  }
}
