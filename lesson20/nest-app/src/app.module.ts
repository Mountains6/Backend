import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ArtifactModule } from './artifact/artifact.module';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), ArticleModule, ArtifactModule, CarModule, BookModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
