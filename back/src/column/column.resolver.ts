import { Args, ID, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { ColumnService } from './column.service';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AddNewColumnInput } from 'src/board/inputs/add-new-column.input';
import { ChangedColumnsOrder, ColumnAdded, ColumnDeleted, UpdatedColumn } from 'src/board/models/column.model';
import { ChangeColumnOrderInput } from 'src/board/inputs/change-column-order.input';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUserId } from 'src/decorators/get-id-from-token';

@Resolver()
export class ColumnResolver {
  constructor(private readonly columnService: ColumnService, @Inject('PUB_SUB') private readonly pubSub: {
    publish: RedisPubSub['publish'];
    asyncIterator: RedisPubSub['asyncIterator'];
  }) { }

  @Mutation(() => Boolean)
  async addNewColumn(@Args('columnInput') columnInput: AddNewColumnInput) {
    await this.columnService.addNewColumn(columnInput)
    return true
  }

  @Subscription(() => ColumnAdded, {
    filter(payload, variables, context) {
      return payload.columnAdded.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  columnAdded() {
    return this.pubSub.asyncIterator('columnAdded')
  }

  @Mutation(() => Boolean)
  async deleteColumn(@Args('columnId') columnId: string) {
    await this.columnService.deleteColumn(columnId)
    return true
  }

  @Subscription(() => ColumnDeleted, {
    filter(payload, variables, context) {
      return payload.columnDeleted.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  columnDeleted() {
    return this.pubSub.asyncIterator('columnDeleted')
  }

  @Mutation(() => Boolean)
  async changeColumnTitle(@Args('newTitle') newTitle: string, @Args('columnId') columnId: string,) {
    await this.columnService.changeColumnTitle(newTitle, columnId)
    return true
  }

  @Subscription(() => UpdatedColumn, {
    filter(payload, variables, context) {
      return payload.columnTitleChanged.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  columnTitleChanged() {
    return this.pubSub.asyncIterator('columnTitleChanged');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async changeColumnsOrder(
    @Args('changeColumnInput', { type: () => [ChangeColumnOrderInput] })
    changeColumnInput: ChangeColumnOrderInput[],
    @Args('boardId', { type: () => ID })
    boardId: string,
    @CurrentUserId() movedById: string
  ) {
    await this.columnService.changeColumnsOrder(changeColumnInput, boardId, movedById);
    return true;
  }

  @Subscription(() => ChangedColumnsOrder, {
    filter(payload, variables, context) {
      return payload.columnOrderChanged.recipientsIds.includes(context?.user.id)
    },
  })
  columnOrderChanged() {
    return this.pubSub.asyncIterator('columnOrderChanged')
  }

}
