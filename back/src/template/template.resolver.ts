import { Query, Resolver } from '@nestjs/graphql';
import { TemplateService } from './template.service';
import { BoardTemplate } from './models/board-template.model';

@Resolver()
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query(() => [BoardTemplate])
  async getAllBoardTemplates() {
    const templates = await this.templateService.getAllBoardTemplates();
    console.log('Templates from DB:', templates);
    return templates;
  }
}
