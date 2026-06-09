import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  transform(value: number) {
    if (value < 0) {
      throw new BadRequestException();
    }
    return value;
  }
}
