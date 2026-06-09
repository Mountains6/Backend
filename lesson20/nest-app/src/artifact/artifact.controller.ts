import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RarityPipe } from 'src/common/pipes/rarity.pipe';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreateArtifactSchema } from './artifact.create.dto';
import type { CreateArtifactDto } from './artifact.create.dto';

@Controller('/artifact')
export class ArtifactController {
  // /artifact?skip=1&limit=10&rarity=epic
  @Get()
  getAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('rarity', RarityPipe) rarity: string,
  ) {
    return { skip, limit, rarity };
  }

  @Post()
  createArtifact(
    @Body(new ZodValidationPipe(CreateArtifactSchema)) body: CreateArtifactDto,
  ) {
    return body;
  }
}
