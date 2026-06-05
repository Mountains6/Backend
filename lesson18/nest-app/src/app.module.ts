import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ArtifactModule } from './artifact/artifact.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [ArticleModule, ArtifactModule, CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
