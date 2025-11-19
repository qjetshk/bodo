import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardInput } from './inputs/create-board.input';
import { Prisma } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class BoardService {
    constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

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
            }
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
                    include: {
                        tasks: {
                            include: {
                                assignments: {
                                    include: {
                                        task: {
                                            include: {
                                                comments: {
                                                    include: {
                                                        author: true
                                                    }
                                                },

                                            },

                                        }
                                    }
                                }
                            }
                        },

                    }
                },
                boardTemplate: {
                    include: { columns: true }
                }
            }
        })

        if (!board) {
            throw new NotFoundException('This board doesnt exist')
        }

        const isOwner = board?.ownerId === userId;
        const isMember = board?.members?.some(member => member.userId === userId);

        if (isOwner || isMember) {
            return board
        } else {
            throw new ForbiddenException('You do not have access to this board')
        }
    }

    async getAllUserBoardInvitation(userId: string) {
        const invitations = await this.prismaService.boardInvitation.findMany({
            where:
            {
                AND: [
                    { userId },
                    { status: 'PENDING' }
                ]
            }
            ,
            include: {
                board: {
                    include: {
                        owner: true,                   // владелец доски
                        columns: { include: { tasks: true } }, // колонки и задачи
                        members: { include: { user: true } }  // участники доски
                    }
                },
                user: true,        // приглашённый пользователь
                invitedBy: true    // кто пригласил
            }
        });
        return invitations;
    }

    async acceptInvitation(invitationId: string) {
        const currentInvitation = await this.prismaService.boardInvitation.findUnique({
            where: {
                id: invitationId,
            }
        })

        if (!currentInvitation) {
            throw new NotFoundException('This invitation doesn exist!')
        }

        if (currentInvitation?.status === 'PENDING') {
            const invitation = await this.prismaService.boardInvitation.update({
                where: {
                    id: invitationId
                },
                data: {
                    status: 'ACCEPTED'
                },
                include: {
                    user: true,
                    board: {
                        include: {
                            members: true
                        }
                    }
                }
            })

            const updatedBoard = await this.prismaService.board.update({
                where: { id: invitation.board.id },
                data: {
                    members: {
                        create: {
                            user: {
                                connect: { id: invitation.user.id }
                            }
                        }
                    }
                },
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return updatedBoard

        } else {
            throw new ConflictException('You can accept only pending invitation')
        }



    }

    async declineInvitation(invitationId: string) {
        const currentInvitation = await this.prismaService.boardInvitation.findUnique({
            where: {
                id: invitationId,
            }
        })

        if (!currentInvitation) {
            throw new NotFoundException('This invitation doesn exist!')
        }

        if (currentInvitation?.status === 'PENDING') {
            await this.prismaService.boardInvitation.update({
                where: {
                    id: invitationId
                },
                data: {
                    status: 'DECLINED'
                }
            })

            return true

        } else {
            throw new ConflictException('You can decline only pending invitation')
        }

    }



}
