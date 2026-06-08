import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreateCarSchema } from './car.create.dto';
import type { CreateCarDto } from './car.create.dto';

@Controller('/car')
export class CarController {
    @Post()
      createCar(
        @Body(new ZodValidationPipe(CreateCarSchema)) body: CreateCarDto,
      ) {
        return body;
      }
}
