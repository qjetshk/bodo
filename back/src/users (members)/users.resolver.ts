import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { FindMemberInput } from './inputs/find-member.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async findMembers(@CurrentUserId() id: string, @Args('member') input: FindMemberInput) {
    const members = this.usersService.findMembers(input, id);
    return members;
  }
}
