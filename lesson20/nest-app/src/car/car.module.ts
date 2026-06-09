import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarRepository } from './car.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository, PrismaService]
})

export class CarModule {}