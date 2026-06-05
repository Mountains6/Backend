import { Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articaeService: ArticleService) {}

  @Get()
  findAll() {
    return this.articaeService.findAll();
  }
}
