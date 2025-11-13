import { Resolver } from '@nestjs/graphql';
import { TemplateService } from './template.service';

@Resolver()
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}
}
