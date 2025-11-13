import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindMemberInput } from './inputs/find-member.input';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMembers(input: FindMemberInput, currentUserId: string) {
    const members = await this.prismaService.user.findMany({
      where: {
        NOT: {
          id: currentUserId,
        },
        OR: [
          { nickName: input.nickName },
          { email: input.email }, 
        ],
      },
      select: {
        id: true,
        nickName: true,
        avatarUrl: true,
        email: true,
      },
    });

    return members;
  }
}
