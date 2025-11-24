import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task, CreatedTask, DeletedTask } from './models/task.model';
import { CreateTaskInput } from './inputs/create-task.input';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}

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
}
