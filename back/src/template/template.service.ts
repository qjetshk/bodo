import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBoardTemplates() {
    const templates = await this.prismaService.boardTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        
        columns: {
          select: {
            id: true,
            title: true,
            order: true,
            templateId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return templates;
  }
}
