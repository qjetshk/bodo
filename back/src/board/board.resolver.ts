import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CreateBoardInput } from './inputs/create-board.input';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { Board, BoardDeleted, BoardEdited, UpdatedBoard } from './models/board.model';
import { BoardInvitation } from 'src/users (members)/models/board-invition.model';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { EditBoardInput } from './inputs/edit-board.input';
import { ChangedColumnsOrder, ColumnAdded, ColumnDeleted, UpdatedColumn } from './models/column.model';
import { ChangeColumnOrderInput } from './inputs/change-column-order.input';
import { AddNewColumnInput } from './inputs/add-new-column.input';

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


  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdatedBoard, { nullable: true })
  async editBoard(@Args('editBoardInput') editBoardInput: EditBoardInput, @Args('boardId') boardId: string, @CurrentUserId() id: string) {
    const updatedBoard = await this.boardService.editBoard(editBoardInput, boardId, id)
    return updatedBoard
  }

  @Subscription(() => BoardEdited, {
    filter(payload, variables, context) {
      return payload.boardEdited.members.includes(context?.user.id)
    },
  })
  boardEdited() {
    return this.pubSub.asyncIterator('boardEdited')
  }


  @Mutation(() => Boolean)
  async deleteBoard(@Args('boardId') boardId: string) {
    await this.boardService.deleteBoard(boardId)
    return true
  }

  @Subscription(() => BoardDeleted, {
    filter(payload, variables, context) {
      return payload.boardDeleted.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  boardDeleted() {
    return this.pubSub.asyncIterator('boardDeleted')
  }
  
}
