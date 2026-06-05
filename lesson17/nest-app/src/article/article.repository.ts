// In Memory repository, no real DB
import { Injectable } from '@nestjs/common';
import { Article } from './article.interface';

@Injectable()

export class ArticleRepository {
  private articles: Article[] = [
    {
      id: 0,
      title: 'Optimisation in React',
      content: 'useCallback, useMemo, memo',
      author: 'Dan Abramov',
      createdAt: new Date(),
    },
  ];

  private idCounter = 1;

  findAll(): Article[] {
    return this.articles;
  }
}