import { Args, Int, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task, CreatedTask, DeletedTask, ChangedTasksOrderInColumn, TaskMovedToAnotherColumn } from './models/task.model';
import { CreateTaskInput } from './inputs/create-task.input';
import { Inject, UseGuards } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ChangeTaskOrderInput } from './inputs/change-task-order.input';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUserId } from 'src/decorators/get-id-from-token';
import { ModelTypeWithRecepientsIds } from 'src/common/types/model-type-with-recepients-ids.type';
import { EditTaskInput } from './inputs/edit-task.input';
import { CreatedCommentinput } from './inputs/create-comment.input';
import { EditCommentinput } from './inputs/edit-comment.input';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

  @Mutation(() => Boolean)
  async createTask(@Args('taskInput') taskInput: CreateTaskInput) {
    await this.taskService.createTask(taskInput)
    return true
  }

  @Subscription(() => Task, {
    filter(payload, variables, context) {
      return payload.taskCreated.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  taskCreated() {
    return this.pubSub.asyncIterator('taskCreated')
  }

  @Mutation(() => Boolean)
  async editTask(@Args("taskInput") taskInput: EditTaskInput) {
    await this.taskService.editTask(taskInput)
    return true
  }

  @Subscription(() => Task, {
    filter(payload, variables, context) {
      return payload.taskEdited.membersAndOwnerIds.includes(context?.user.id)
    },
  })
  taskEdited() {
    return this.pubSub.asyncIterator('taskEdited')
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
  async changeTasksOrder(@Args('newTasks', { type: () => [ChangeTaskOrderInput] }) newTasks: ChangeTaskOrderInput[], @Args('columnId') columnId: string, @CurrentUserId() movedById: string) {
    await this.taskService.changeTasksOrder(newTasks, columnId, movedById)
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

  @Mutation(() => Boolean)
  async createComment(@Args('commentInput') commentInput: CreatedCommentinput) {
    await this.taskService.createComment(commentInput)
    return true
  }

  @Mutation(() => Boolean)
  async editComment(@Args('commentInput') commentInput: EditCommentinput) {
    await this.taskService.editComment(commentInput)
    return true
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args('commentId') commentId: string) {
    await this.taskService.deleteComment(commentId)
    return true
  }

}
