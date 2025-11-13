import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateResolver } from './template.resolver';

@Module({
  providers: [TemplateResolver, TemplateService],
})
export class TemplateModule {}
