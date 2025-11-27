import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput } from './inputs/create-task.input';
import { ChangeTaskOrderInput } from './inputs/change-task-order.input';
import { getOwnerAndMembersIds, getRecipientsIds } from 'src/utils/get-owner-members-ids.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
    constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

    async createTask(taskInput: CreateTaskInput) {
        const currentColumn = await this.prismaService.column.findUnique({
            where: {
                id: taskInput.columnId
            },
            include: {
                tasks: true
            }
        })

        if (!currentColumn) {
            console.log('asdasd')
            throw new NotFoundException('Такой колонки не существует!')
        }

        const newTask = await this.prismaService.$transaction(async (tx) => {
            const tasks = await tx.task.findMany({
                where: { columnId: currentColumn.id },
                orderBy: { order: 'asc' },
            });

            const newOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0;

            return tx.task.create({
                data: {
                    ...taskInput,
                    order: newOrder
                },
                include: {
                    column: {
                        include: {
                            board: {
                                include: {
                                    members: {
                                        include: { user: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });

        const boardUpdatedAt = await this.prismaService.board.update({
            where: {
                id: newTask.column.boardId
            },
            data: {
                updatedAt: new Date()
            },
            select: {
                updatedAt: true
            }
        })

        await this.pubSub.publish('taskCreated', {
            taskCreated: {
                id: newTask.id,
                title: newTask.title,
                columnId: newTask.columnId,
                description: newTask.description,
                order: newTask.order,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof newTask.column.board>(newTask.column.board),
                updatedAt: boardUpdatedAt.updatedAt
            }
        })

        return true
    }

    async deleteTask(taskId: string) {
        return this.prismaService.$transaction(async (tx) => {

            const deletedTask = await tx.task.delete({
                where: {
                    id: taskId
                },
                select: {
                    columnId: true
                }
            })

            const columnId = deletedTask.columnId;

            const tasks = await tx.task.findMany({
                where: {
                    columnId
                },
                orderBy: {
                    order: 'asc'
                }
            })

            await Promise.all(
                tasks.map((task, i) =>
                    tx.task.update({
                        where: { id: task.id },
                        data: { order: i }
                    })
                )
            )

            const newColumn = await tx.column.findUnique({
                where: {
                    id: columnId
                },
                include: {
                    board: {
                        include: {
                            members: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    },
                    tasks: {
                        orderBy: { order: 'asc' }
                    }
                }
            })

            if (!newColumn) {
                return false
            }

            const boardUpdatedAt = await tx.board.update({
                where: {
                    id: newColumn.boardId
                },
                data: {
                    updatedAt: new Date()
                },
                select: {
                    updatedAt: true
                }
            })

            await this.pubSub.publish('taskDeleted', {
                taskDeleted: {
                    columnId,
                    boardUpdatedAt: boardUpdatedAt.updatedAt,
                    tasks: newColumn?.tasks,
                    membersAndOwnerIds: getOwnerAndMembersIds<typeof newColumn.board>(newColumn.board)
                }
            })

            return true
        })
    }


    async changeTasksOrderInOneColumn(newTasks: ChangeTaskOrderInput[], columnId: string, movedById: string) {
        const column = await this.prismaService.column.findUnique({
            where: {
                id: columnId
            }
        })

        if (!column) {
            throw new NotFoundException('Такой колонки не существует!')
        }

        await this.prismaService.$transaction(async (tx) => {
            for (const tasks of newTasks) {
                await tx.task.update({
                    where: {
                        id: tasks.id
                    },
                    data: {
                        order: tasks.order,
                        columnId
                    }
                })
            }
        })

        const updatedColumn = await this.prismaService.column.findUnique({
            where: {
                id: columnId
            },
            include: {
                tasks: true
            }
        })

        const board = await this.prismaService.board.update({
            where: {
                id: updatedColumn?.boardId
            },
            data: {
                updatedAt: new Date()
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!board) {
            throw new NotFoundException('Такой доски не существует!')
        }

        const recipientsIds = getRecipientsIds<typeof board>(board, movedById)

        await this.pubSub.publish('tasksOrderChangedInOneColumn', {
            tasksOrderChangedInOneColumn: {
                columnId: updatedColumn?.id,
                tasks: updatedColumn?.tasks,
                recipientsIds
            }
        })

        return true
    }
}
