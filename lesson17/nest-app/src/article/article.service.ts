import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  findAll() {
    return this.articleRepository.findAll();
  }
}
