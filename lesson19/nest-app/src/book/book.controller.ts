import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreateBookSchema } from './book.create.dto';
import type { CreateBookDto } from './book.create.dto';
import { BookService } from './book.service';

@Controller('/book')
export class BookController {
  constructor(private readonly service: BookService) {}

  @Get()
  getAllBooks() {
    return this.service.findAll();
  }

  @Get('/:id')
  getBookById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Delete('/:id')
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Post()
  createBook(@Body(new ZodValidationPipe(CreateBookSchema)) dto: CreateBookDto) {
    return this.service.create(dto);
  }
}
