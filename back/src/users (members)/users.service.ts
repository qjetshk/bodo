import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindMemberInput } from './inputs/find-member.input';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService, @Inject('PUB_SUB') private readonly pubSub: RedisPubSub) { }

  async findMembers(input: FindMemberInput, currentUserId: string) {
    const members = await this.prismaService.user.findMany({
      where: {
        NOT: {
          id: currentUserId,
        },
        OR: [
          {
            nickName: {
              contains: input.nickName?.toLocaleLowerCase(),
            },
          },
          {
            email: {
              contains: input.email?.toLocaleLowerCase(),
            },
          },
        ],
      },
      select: {
        id: true,
        nickName: true,
        avatarUrl: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return members;
  }

  async getAllUserInvations(id: string) {
    const invations = await this.prismaService.boardInvitation.findMany({
      where: {
        userId: id,
        status: 'PENDING'
      }
    })

    return invations
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
            owner: true,                   
            columns: { include: { tasks: true } }, 
            members: { include: { user: true } }  
          }
        },
        user: true,        
        invitedBy: true   
      }
    });
    return invitations;
  }

  async acceptInvitation(invitationId: string) {
    const currentInvitation = await this.prismaService.boardInvitation.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        user: true,
      },
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

      await this.pubSub.publish('invitationAccepted', {
        invitationAccepted: {
          id: currentInvitation.id,
          boardId: currentInvitation.boardId,
          invitedById: currentInvitation.invitedById,
          member: updatedBoard.members.find(
            m => m.userId === invitation.user.id
          )
        }
      })

      return updatedBoard

    } else {
      throw new ConflictException('You can accept only pending invitation')
    }
  }

  async declineInvitation(invitationId: string) {
    const currentInvitation = await this.prismaService.boardInvitation.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        user: true
      }
    })

    if (!currentInvitation) {
      throw new NotFoundException('This invitation doesn exist!')
    }

    const currentBoard = await this.prismaService.board.findUnique({
      where: {
        id: currentInvitation.boardId
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    })

    if (currentInvitation?.status === 'PENDING') {
      await this.prismaService.boardInvitation.update({
        where: {
          id: invitationId
        },
        data: {
          status: 'DECLINED'
        }
      })

      await this.pubSub.publish('invitationDeclined', {
        invitationDeclined: {
          id: currentInvitation.id,
          boardId: currentInvitation.boardId,
          invitedById: currentInvitation.invitedById,
          member: currentBoard?.members.find(
            m => m.userId === currentInvitation.userId
          )
        }
      })

      return true

    } else {
      throw new ConflictException('You can decline only pending invitation')
    }

  }


}
