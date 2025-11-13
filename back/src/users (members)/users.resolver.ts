import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { FindMemberInput } from './inputs/find-member.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => [User]) // возвращаем массив пользователей
  @UseGuards(GqlAuthGuard) // подключаем Guard для проверки токена
  async findMembers(
    @CurrentUserId() id: string,
    @Args('member') input: FindMemberInput
  ) {
    const members = await this.usersService.findMembers(input, id);
    return members;
  }
}
