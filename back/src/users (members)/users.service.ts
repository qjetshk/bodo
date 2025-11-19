import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindMemberInput } from './inputs/find-member.input';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

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


}
