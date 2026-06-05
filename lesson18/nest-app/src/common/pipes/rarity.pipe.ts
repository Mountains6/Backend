import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RarityPipe implements PipeTransform {
  private readonly allowedRarities = ['common', 'rare', 'epic', 'legendary'];
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('Rarity is required');
    }

    if (!this.allowedRarities.includes(value)) {
      throw new BadRequestException(
        `Invalid rarity. Allowed values: ${this.allowedRarities.join(', ')}`,
      );
    }
    return value;
  }
}
