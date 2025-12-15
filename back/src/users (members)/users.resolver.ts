import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { FindMemberInput } from './inputs/find-member.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Request } from 'express';
import { AcceptedOrDeclinedInvitation, BoardInvitation } from './models/board-invition.model';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Board } from 'src/board/models/board.model';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService, @Inject('PUB_SUB') private readonly pubSub: {
    publish: RedisPubSub['publish'];
    asyncIterator: RedisPubSub['asyncIterator'];
  }) { }

  @Mutation(() => [User])
  @UseGuards(GqlAuthGuard)
  async findMembers(
    @CurrentUserId() id: string,
    @Context() ctx,
    @Args('member') input: FindMemberInput
  ) {
    const cookies = ctx.req.cookies
    const members = await this.usersService.findMembers(input, id);
    return members;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BoardInvitation])
  async getAllUserInvations(@CurrentUserId() id: string,) {
    const invations = await this.usersService.getAllUserInvations(id)
    return invations
  }

  @Subscription(() => BoardInvitation, {
    filter: (payload, variables, context) => {
      return context.user?.id === payload.invitationCreated.userId;
    }
  })
  invitationCreated() {
    return this.pubSub.asyncIterator('invitationCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BoardInvitation])
  async getAllUserBoardInvitation(@CurrentUserId() id: string) {
    const invations = await this.usersService.getAllUserBoardInvitation(id)
    return invations
  }

  @Mutation(() => Board)
  async acceptInvitation(@Args('invitationId') invitationId: string) {
    const updatedBoard = await this.usersService.acceptInvitation(invitationId)
    return updatedBoard
  }

  @Mutation(() => Boolean)
  async declineInvitation(@Args('invitationId') invitationId: string) {
    await this.usersService.declineInvitation(invitationId)
    return true
  }

  @Subscription(() => AcceptedOrDeclinedInvitation, {
    filter: (payload, variables, context) => {
      return context.user?.id === payload.invitationAccepted.invitedById;
    }
  })
  invitationAccepted() {
    return this.pubSub.asyncIterator('invitationAccepted')
  }

  @Subscription(() => AcceptedOrDeclinedInvitation, {
    filter: (payload, variables, context) => {
      return context.user?.id === payload.invitationDeclined.invitedById;
    }
  })
  invitationDeclined() {
    return this.pubSub.asyncIterator('invitationDeclined')
  }

}
