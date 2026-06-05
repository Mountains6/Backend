import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreateCarSchema } from './cars.create.dto';
import type { CreateCarDto } from './cars.create.dto';

@Controller('cars')
export class CarsController {
    @Post()
      createArtifact(
        @Body(new ZodValidationPipe(CreateCarSchema)) body: CreateCarDto,
      ) {
        return body;
      }
}
