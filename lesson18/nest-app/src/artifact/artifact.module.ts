import { Module } from '@nestjs/common';
import { ArtifactController } from './artifact.controller';

@Module({
  controllers: [ArtifactController]
})
export class ArtifactModule {}
