import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput } from './inputs/create-task.input';
import { ChangeTaskOrderInput } from './inputs/change-task-order.input';
import { getOwnerAndMembersIds, getRecipientsIds } from 'src/utils/get-owner-members-ids.util';
import { Prisma } from '@prisma/client';
import { ChangedTasksOrderInColumn, DeletedTask, TaskMovedToAnotherColumn } from './models/task.model';
import { ModelTypeWithRecepientsIds } from 'src/common/types/model-type-with-recepients-ids.type';
import { EditTaskInput } from './inputs/edit-task.input';
import { CreatedCommentinput } from './inputs/create-comment.input';
import { EditCommentinput } from './inputs/edit-comment.input';

@Injectable()
export class TaskService {
    constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: {
    publish: RedisPubSub['publish'];
    asyncIterator: RedisPubSub['asyncIterator'];
  }) { }

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
                    title: taskInput.title,
                    description: taskInput.description,
                    deadlineDate: taskInput.deadlineDate,
                    priority: taskInput.priority,
                    order: newOrder,
                    columnId: taskInput.columnId,
                    assignments: {
                        create: (taskInput.membersIds ?? []).map(userId => ({ userId }))
                    }
                },
                include: {
                    assignments: {
                        include: {
                            user: true
                        }
                    },
                    comments: {
                        include: {
                            author: true,
                        }
                    },
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
                updatedAt: newTask.updatedAt,
                createdAt: newTask.createdAt,
                assignments: newTask.assignments,
                comments: newTask.comments,
                deadlineDate: newTask.deadlineDate,
                priority: newTask.priority
            }
        })

        return true
    }

    async editTask(taskInput: EditTaskInput) {
        const currentTask = await this.prismaService.task.findUnique({
            where: { id: taskInput.id },
            include: { assignments: true } // ← важно!
        });

        if (!currentTask) {
            throw new NotFoundException('Такой таски не существует!');
        }

        // 2. Получаем текущие и новые ID пользователей
        const currentMemberIds = new Set(currentTask.assignments.map(a => a.userId));
        const newMemberIds = new Set(taskInput.membersIds || []);

        // 3. Определяем, кого удалить и кого добавить
        const toDelete = currentTask.assignments
            .filter(a => !newMemberIds.has(a.userId))
            .map(a => a.id);

        const toCreate = Array.from(newMemberIds)
            .filter(userId => !currentMemberIds.has(userId))
            .map(userId => ({ userId }));

        // 4. Выполняем обновление задачи + управление связями
        await this.prismaService.$transaction([
            // Сначала обновляем саму задачу
            this.prismaService.task.update({
                where: { id: taskInput.id },
                data: {
                    title: taskInput.title,
                    description: taskInput.description,
                    deadlineDate: taskInput.deadlineDate,
                    priority: taskInput.priority,
                    updatedAt: new Date(),
                },
            }),

            // Удаляем старые связи
            ...(toDelete.length > 0
                ? [this.prismaService.taskAssignment.deleteMany({ where: { id: { in: toDelete } } })]
                : []),

            // Добавляем новые связи
            ...(toCreate.length > 0
                ? [this.prismaService.taskAssignment.createMany({
                    data: toCreate.map(userId => ({ ...userId, taskId: taskInput.id }))
                })]
                : [])


        ]);

        const updatedTask = await this.prismaService.task.findUnique({
            where: {
                id: currentTask.id
            },
            include: {
                assignments: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        author: true,
                    }
                },
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
        })

        if (!updatedTask) {
            throw new NotFoundException('Такой таски не существует!');
        }

        await this.prismaService.board.update({
            where: {
                id: updatedTask.column.boardId
            },
            data: {
                updatedAt: new Date()
            }
        })

        await this.pubSub.publish('taskEdited', {
            taskEdited: {
                id: updatedTask.id,
                title: updatedTask.title,
                columnId: updatedTask.columnId,
                description: updatedTask.description,
                order: updatedTask.order,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof updatedTask.column.board>(updatedTask.column.board),
                updatedAt: updatedTask.updatedAt,
                createdAt: updatedTask.createdAt,
                assignments: updatedTask.assignments,
                comments: updatedTask.comments,
                deadlineDate: updatedTask.deadlineDate,
                priority: updatedTask.priority
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
                    columnId: true,
                    id: true
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
                        orderBy: { order: 'asc' },
                        include: {
                            assignments: {
                                include: {
                                    user: true
                                }
                            },
                            comments: {
                                include: {
                                    author: true,
                                }
                            },
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
                    taskId: deletedTask.id,
                    columnId: newColumn.id,
                    membersAndOwnerIds: getOwnerAndMembersIds<typeof newColumn.board>(newColumn.board)
                }
            })

            return true
        })
    }


    async changeTasksOrder(newTasks: ChangeTaskOrderInput[], columnId: string, movedById: string) {
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
                },
                columns: {
                    include: {
                        tasks: true
                    }
                }
            }
        })

        if (!board) {
            throw new NotFoundException('Такой доски не существует!')
        }

        const tasks = board.columns.flatMap(c =>
            c.tasks.map(t => ({
                id: t.id,
                order: t.order,
                columnId: c.id
            }))
        );

        const recipientsIds = getRecipientsIds<typeof board>(board, movedById)

        await this.pubSub.publish('tasksOrderChangedInOneColumn', {
            tasksOrderChangedInOneColumn: {
                columnId: updatedColumn?.id,
                tasks,
                recipientsIds
            } as ModelTypeWithRecepientsIds<ChangedTasksOrderInColumn>
        })

        return true
    }

    async createComment(commentInput: CreatedCommentinput, userId: string) {
        const comment = await this.prismaService.comment.create({
            data: {
                content: commentInput.content,
                authorId: userId,
                taskId: commentInput.taskId
            }
        })

        if (!comment) {
            throw new NotFoundException('Такого коммента не существует!')
        }

        const updatedTask = await this.prismaService.task.findUnique({
            where: {
                id: comment.taskId
            },
            include: {
                assignments: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        author: true,
                    }
                },
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
        })

        if (!updatedTask) {
            throw new NotFoundException('Такой таски не существует!');
        }

        await this.prismaService.board.update({
            where: {
                id: updatedTask.column.boardId
            },
            data: {
                updatedAt: new Date()
            }
        })

        await this.pubSub.publish('taskEdited', {
            taskEdited: {
                id: updatedTask.id,
                title: updatedTask.title,
                columnId: updatedTask.columnId,
                description: updatedTask.description,
                order: updatedTask.order,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof updatedTask.column.board>(updatedTask.column.board),
                createdAt: updatedTask.createdAt,
                updatedAt: updatedTask.updatedAt,
                assignments: updatedTask.assignments,
                comments: updatedTask.comments,
                deadlineDate: updatedTask.deadlineDate,
                priority: updatedTask.priority
            }
        })

        return true
    }

    async editComment(commentInput: EditCommentinput) {
        const updatedComment = await this.prismaService.comment.update({
            where: {
                id: commentInput.id
            },
            data: {
                content: commentInput.content,
            }
        })

        if (!updatedComment) {
            throw new NotFoundException('Такого коммента не существует!')
        }

        const updatedTask = await this.prismaService.task.findUnique({
            where: {
                id: updatedComment.taskId
            },
            include: {
                assignments: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        author: true,
                    }
                },
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
        })

        if (!updatedTask) {
            throw new NotFoundException('Такой таски не существует!');
        }

        await this.prismaService.board.update({
            where: {
                id: updatedTask.column.boardId
            },
            data: {
                updatedAt: new Date()
            }
        })

        await this.pubSub.publish('taskEdited', {
            taskEdited: {
                id: updatedTask.id,
                title: updatedTask.title,
                columnId: updatedTask.columnId,
                description: updatedTask.description,
                order: updatedTask.order,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof updatedTask.column.board>(updatedTask.column.board),
                createdAt: updatedTask.createdAt,
                updatedAt: updatedTask.updatedAt,
                assignments: updatedTask.assignments,
                comments: updatedTask.comments,
                deadlineDate: updatedTask.deadlineDate,
                priority: updatedTask.priority
            }
        })

        return true
    }

    async deleteComment(id: string) {
        const deletedComment = await this.prismaService.comment.delete({
            where: {
                id
            }
        })

        if (!deletedComment) {
            throw new NotFoundException('Такого коммента не существует!')
        }

        const updatedTask = await this.prismaService.task.findUnique({
            where: {
                id: deletedComment.taskId
            },
            include: {
                assignments: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        author: true,
                    }
                },
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
        })

        if (!updatedTask) {
            throw new NotFoundException('Такой таски не существует!');
        }

        await this.prismaService.board.update({
            where: {
                id: updatedTask.column.boardId
            },
            data: {
                updatedAt: new Date()
            }
        })

        await this.pubSub.publish('taskEdited', {
            taskEdited: {
                id: updatedTask.id,
                title: updatedTask.title,
                columnId: updatedTask.columnId,
                description: updatedTask.description,
                order: updatedTask.order,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof updatedTask.column.board>(updatedTask.column.board),
                updatedAt: updatedTask.updatedAt,
                createdAt: updatedTask.createdAt,
                assignments: updatedTask.assignments,
                comments: updatedTask.comments,
                deadlineDate: updatedTask.deadlineDate,
                priority: updatedTask.priority
            }
        })

        return true
    }
}
