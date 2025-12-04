import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task, CreatedTask, DeletedTask, ChangedTasksOrderInColumn, TaskMovedToAnotherColumn } from './models/task.model';
import { CreateTaskInput } from './inputs/create-task.input';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ChangeTaskOrderInput } from './inputs/change-task-order.input';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { ModelTypeWithRecepientsIds } from 'src/common/types/model-type-with-recepients-ids.type';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

  @Mutation(() => Boolean)
  async createTask(@Args('taskInput') taskInput: CreateTaskInput) {
    await this.taskService.createTask(taskInput)
    return true
  }

  @Subscription(() => CreatedTask, {
    filter(payload, variables, context) {
      return payload.taskCreated.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  taskCreated() {
    return this.pubSub.asyncIterator('taskCreated')
  }

  @Mutation(() => Boolean)
  async deleteTask(@Args('taskId') taskId: string) {
    await this.taskService.deleteTask(taskId)
    return true
  }

  @Subscription(() => DeletedTask, {
    filter(payload, variables, context) {
      return payload.taskDeleted.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  taskDeleted() {
    return this.pubSub.asyncIterator('taskDeleted')
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async changeTasksOrderInOneColumn(@Args('newTasks', { type: () => [ChangeTaskOrderInput] }) newTasks: ChangeTaskOrderInput[], @Args('columnId') columnId: string, @CurrentUserId() movedById: string) {
    await this.taskService.changeTasksOrderInOneColumn(newTasks, columnId, movedById)
    return true
  }

  @Subscription(() => ChangedTasksOrderInColumn, {
    filter(payload, variables, context) {
      return payload.tasksOrderChangedInOneColumn.recipientsIds.includes(context?.user.id)
    },
  })
  tasksOrderChangedInOneColumn() {
    return this.pubSub.asyncIterator('tasksOrderChangedInOneColumn')
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async moveTaskToAnotherColumn(@Args('prevColTasks', { type: () => [ChangeTaskOrderInput] }) prevColTasks: ChangeTaskOrderInput[], @Args('curColTasks', { type: () => [ChangeTaskOrderInput] }) curColTasks: ChangeTaskOrderInput[], @CurrentUserId() movedById: string) {
    await this.taskService.moveTaskToAnotherColumn(prevColTasks, curColTasks, movedById)
    return true
  }

  @Subscription(() => TaskMovedToAnotherColumn, {
    filter(payload, variables, context) {
      const taskMovedToAnotherColumn: ModelTypeWithRecepientsIds<TaskMovedToAnotherColumn> = payload.taskMovedToAnotherColumn
      return taskMovedToAnotherColumn.recipientsIds.includes(context?.user.id)
    },
  })
  taskMovedToAnotherColumn() {
    return this.pubSub.asyncIterator('taskMovedToAnotherColumn')
  }

}
