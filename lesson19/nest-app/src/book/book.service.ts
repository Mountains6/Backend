import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './book.create.dto';

@Injectable()
export class BookService {
  constructor(private readonly repo: BookRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const book = await this.repo.findById(id);

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async create(bookDto: CreateBookDto) {
    return this.repo.create(bookDto);
  }

  async delete(id: number) {
    const book = await this.repo.findById(id);

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return this.repo.delete(book.id);
  }
}
