import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [BookController],
  providers: [BookService, BookRepository, PrismaService],
})
export class BookModule {}
