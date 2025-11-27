import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AddNewColumnInput } from 'src/board/inputs/add-new-column.input';
import { ChangeColumnOrderInput } from 'src/board/inputs/change-column-order.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { getOwnerAndMembersIds } from 'src/utils/get-owner-members-ids.util';

@Injectable()
export class ColumnService {
    constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

    async changeColumnTitle(newTitle: string, columnId: string) {
        if (!newTitle || newTitle.trim().length === 0) {
            throw new ConflictException('Название не может быть пустым!');
        }

        const currentColumn = await this.prismaService.column.findUnique({
            where: { id: columnId },
            include: {
                board: {
                    include: {
                        members: { include: { user: true } }
                    }
                }
            }
        });

        if (!currentColumn) {
            throw new NotFoundException("Колонка не найдена");
        }

        if (currentColumn.title === newTitle) {
            throw new ConflictException('Вы не поменяли название колонки!');
        }

        const updatedColumn = await this.prismaService.column.update({
            where: { id: currentColumn.id },
            data: { title: newTitle },
            select: {
                id: true,
                title: true,
                boardId: true
            }
        });

        const board = await this.prismaService.board.update({
            where: { id: updatedColumn.boardId },
            data: { updatedAt: new Date() },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });

        await this.pubSub.publish('columnTitleChanged', {
            columnTitleChanged: {
                id: updatedColumn.id,
                title: updatedColumn.title,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof board>(board)
            }
        });
    }


    async changeColumnsOrder(columns: ChangeColumnOrderInput[], boardId: string) {
        const currentBoard = await this.prismaService.board.findUnique({
            where: { id: boardId }
        })

        if (!currentBoard) {
            throw new NotFoundException('Такой доски не существует!')
        }

        const updatedColumns = await this.prismaService.$transaction(
            columns.map(col =>
                this.prismaService.column.update({
                    where: { id: col.id },
                    data: { order: col.order },
                    select: {
                        id: true,
                        order: true,
                    },
                })
            )
        );

        updatedColumns.sort((a, b) => a.order - b.order);

        const updatedBoard = await this.prismaService.board.update({
            where: { id: boardId },
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
        });;

        await this.pubSub.publish("columnOrderChanged", {
            columnOrderChanged: {
                boardId,
                columns: updatedColumns,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof updatedBoard>(updatedBoard)
            }
        });

        return true

    }


    async addNewColumn(columnInput: AddNewColumnInput) {
        const board = await this.prismaService.board.findUnique({
            where: {
                id: columnInput.boardId
            },
            include: {
                columns: true,
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!board) {
            throw new NotFoundException("Такой доски не существует!")
        }

        const order = board.columns.length

        const newColumn = await this.prismaService.column.create({
            data: {
                order,
                title: columnInput.title,
                boardId: columnInput.boardId
            },
            include: {
                tasks: true
            }
        })

        await this.pubSub.publish('columnAdded', {
            columnAdded: {
                id: newColumn.id,
                title: newColumn.title,
                order: newColumn.order,
                boardId: newColumn.boardId,
                tasks: newColumn.tasks,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof board>(board)
            }
        })

        await this.prismaService.board.update({
            where: {
                id: board.id
            },
            data: {
                updatedAt: new Date()
            }
        })

        return true
    }

    async deleteColumn(columnId: string) {
        const deletedColumn = await this.prismaService.column.delete({
            where: {
                id: columnId
            }
        })

        if (!deletedColumn) {
            throw new NotFoundException('Такой колонки не существует!')
        }

        const board = await this.prismaService.board.findUnique({
            where: {
                id: deletedColumn.boardId
            },
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                },
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

        const updatedColumns = await this.prismaService.$transaction(
            board.columns.map(col =>
                this.prismaService.column.update({
                    where: { id: col.id },
                    data: { order: col.order },
                    include: {
                        tasks: true
                    },
                })
            )
        );

        updatedColumns.sort((a, b) => a.order - b.order);

        await this.prismaService.board.update({
            where: { id: board.id },
            data: {
                updatedAt: new Date()
            }
        })

        await this.pubSub.publish('columnDeleted', {
            columnDeleted: {
                columns: updatedColumns,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof board>(board)
            }
        })

        return true
    }
}
