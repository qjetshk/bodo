import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CreateBoardInput } from './inputs/create-board.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { Board } from './models/board.model';
import { BoardInvitation } from 'src/users (members)/models/board-invition.model';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Board)
  async createBoard(@Args('boardInput') boardInput: CreateBoardInput, @CurrentUserId() id: string) {
    const newBoard = await this.boardService.createBoard(boardInput, id)
    return newBoard
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Board])
  async getAllUserBoards(@CurrentUserId() id: string) {
    const boards = await this.boardService.getAllUserBoards(id)
    return boards
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Board)
  async getBoardById(@Args('boardId') boardId: string, @CurrentUserId() id: string) {
    const board = await this.boardService.getBoardById(boardId, id)
    return board
  }

  @Subscription(() => BoardInvitation, {
    filter: (payload, variables, context) => {
      console.log(context)
      return context.user?.id === payload.invitationCreated.userId;
    }
  }) 
  invitationCreated() {
    return this.pubSub.asyncIterator('invitationCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BoardInvitation])
  async getAllUserBoardInvitation(@CurrentUserId() id: string) {
    const invations = await this.boardService.getAllUserBoardInvitation(id)
    return invations
  }

  @Mutation(() => Board)
  async acceptInvitation(@Args('invitationId') invitationId: string) {
    const updatedBoard = await this.boardService.acceptInvitation(invitationId)
    return updatedBoard
  }

  @Mutation(() => Boolean)
  async declineInvitation(@Args('invitationId') invitationId: string) {
    await this.boardService.declineInvitation(invitationId)
    return true
  }

}
