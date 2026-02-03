import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardInput } from './inputs/create-board.input';
import { Prisma } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { EditBoardInput } from './inputs/edit-board.input';
import { ChangeColumnOrderInput } from './inputs/change-column-order.input';
import { AddNewColumnInput } from './inputs/add-new-column.input';
import { ApolloGatewayDriver } from '@nestjs/apollo';
import { getOwnerAndMembersIds } from 'src/utils/get-owner-members-ids.util';

@Injectable()
export class BoardService {
    constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: {
        publish: RedisPubSub['publish'];
        asyncIterator: RedisPubSub['asyncIterator'];
    }) { }

    async createBoard(boardInput: CreateBoardInput, ownerId: string) {
        let columnsData: Prisma.ColumnCreateWithoutBoardInput[] = [];
        if (boardInput.boardTemplateId) {
            const templateColumns = await this.prismaService.columnTemplate.findMany({
                where: { templateId: boardInput.boardTemplateId }
            });
            columnsData = templateColumns.map(c => ({ title: c.title, order: c.order }));
        }

        const board = await this.prismaService.board.create({
            data: {
                name: boardInput.name,
                description: boardInput.description,
                boardType: boardInput.boardType,
                ownerId,
                boardTemplateId: boardInput.boardTemplateId,
                columns: { create: columnsData }
            },
            include: {
                owner: true,
                columns: {
                    include: { tasks: true }
                },
                members: { include: { user: true } }
            }
        });

        if (boardInput.membersToAdd && boardInput.membersToAdd.length > 0) {
            const invitationsData = boardInput.membersToAdd.map(userId => ({
                boardId: board.id,
                userId,
                invitedById: board.ownerId
            }));

            await this.prismaService.boardInvitation.createMany({
                data: invitationsData,
            });

            const createdInvitations = await this.prismaService.boardInvitation.findMany({
                where: { boardId: board.id },
                include: {
                    board: {
                        include: {
                            owner: true,
                            columns: { include: { tasks: true } },
                            members: { include: { user: true } }
                        }
                    },
                    user: true,
                    invitedBy: true
                }
            });

            for (const inv of createdInvitations) {
                await this.pubSub.publish('invitationCreated', {
                    invitationCreated: {
                        ...inv,
                        createdAt: inv.createdAt,
                        updatedAt: inv.updatedAt
                    },

                });

            }


        }


        return board;
    }

    async getAllUserBoards(userId: string) {
        const boards = await this.prismaService.board.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } }
                ]
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                owner: true
            },
            orderBy: { updatedAt: 'asc' }
        })

        return boards
    }

    async getBoardById(boardId: string, userId: string) {
        const board = await this.prismaService.board.findUnique({
            where: { id: boardId },
            include: {
                owner: true,
                members: {
                    include: { user: true }
                },
                columns: {
                    orderBy: { order: 'asc' },
                    include: {
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
                                        author: true
                                    }
                                }
                            }
                        },

                    }
                },
                boardTemplate: {
                    include: { columns: true }
                }
            },
        })

        if (!board) {
            throw new NotFoundException("There is no such board!")
        }


        const isOwner = board?.ownerId === userId;
        const isMember = board?.members?.some(member => member.userId === userId);

        if (isOwner || isMember) {
            return board
        } else {
            throw new ForbiddenException("You don't have access to this board, ask its owner to add you!")
        }
    }


    async editBoard(editBoardInput: EditBoardInput, boardId: string, userId: string) {
        const currentBoard = await this.prismaService.board.findUnique({
            where: { id: boardId },
            include: {
                members: {
                    include: { user: true }
                }
            }
        })

        if (!currentBoard) {
            throw new NotFoundException('No such board found!')
        }

        if (currentBoard.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to edit this board!')
        }

        if (editBoardInput.membersToAdd?.includes(currentBoard.ownerId)) {
            throw new ConflictException('You cannot add the board owner to its members!')
        }

        const updatedBoard = await this.prismaService.board.update({
            where: { id: currentBoard.id },
            data: {
                name: editBoardInput.name,
                description: editBoardInput.description
            },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                }
            }
        })

        const boardMembersIds = currentBoard.members.map(member => {
            return member.user.id
        })

        const newMembersOnly = editBoardInput?.membersToAdd?.filter(
            userId => !boardMembersIds.includes(userId)
        );

        if (
            (currentBoard.name === editBoardInput.name) &&
            (currentBoard.description === editBoardInput.description) &&
            (newMembersOnly && newMembersOnly.length === 0)
        ) {
            throw new ConflictException("You haven't changed anything!")
        }

        if (newMembersOnly && newMembersOnly.length > 0) {
            const invitationsData = newMembersOnly.map(userId => ({
                boardId: currentBoard.id,
                userId,
                invitedById: currentBoard.ownerId
            }));

            const currentInvitations = await this.prismaService.boardInvitation.findMany({
                where: {
                    boardId: currentBoard.id,

                },
                select: {
                    userId: true
                }
            })

            if (currentInvitations.length >= 5) {
                throw new ConflictException('You cannot invite more than 5 users!')
            }

            const invitedMembersIds = currentInvitations.flatMap(inv => inv.userId)

            for (const member of newMembersOnly) {
                if (invitedMembersIds.includes(member)) {
                    throw new ConflictException('You have already invited these users!')
                }
            }

            await this.prismaService.boardInvitation.createMany({
                data: invitationsData,
            });

            const createdInvitations = await this.prismaService.boardInvitation.findMany({
                where: {
                    boardId: currentBoard.id,
                    userId: { in: newMembersOnly }
                },
                include: {
                    board: {
                        include: {
                            owner: true,
                            columns: { include: { tasks: true } },
                            members: { include: { user: true } }
                        }
                    },
                    user: true,
                    invitedBy: true
                }
            });

            for (const inv of createdInvitations) {
                await this.pubSub.publish('invitationCreated', {
                    invitationCreated: {
                        ...inv,
                        userId: inv.userId,
                        createdAt: inv.createdAt,
                        updatedAt: inv.updatedAt
                    },

                });

            }
        }

        await this.pubSub.publish('boardEdited', {
            boardEdited: {
                id: updatedBoard.id,
                name: updatedBoard.name,
                description: updatedBoard.description,
                updatedAt: updatedBoard.updatedAt,
                members: updatedBoard.members.map(m => m.userId),
            }
        })

        await this.prismaService.board.update({
            where: {
                id: currentBoard.id
            },
            data: {
                updatedAt: new Date()
            }
        })

        return updatedBoard
    }



    async deleteBoard(boardId: string) {
        const deletedBoard = await this.prismaService.board.delete({
            where: {
                id: boardId
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!deletedBoard) {
            throw new NotFoundException("There is no such board!")
        }

        await this.pubSub.publish('boardDeleted', {
            boardDeleted: {
                id: deletedBoard.id,
                name: deletedBoard.name,
                membersAndOwnerIds: getOwnerAndMembersIds<typeof deletedBoard>(deletedBoard)
            }
        })

        return true

    }



}
