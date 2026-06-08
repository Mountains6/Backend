import { Injectable, NotFoundException } from '@nestjs/common';
import { CarRepository } from './car.repository';
import { CreateCarDto } from './car.create.dto';

@Injectable()
export class CarService {
  constructor(private readonly repo: CarRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const car = await this.repo.findById(id);
    
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  async create(carDto: CreateCarDto) {
    return this.repo.create(carDto);
  }

  async delete(id: number) {
    const car = await this.repo.findById(id);

    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return this.repo.delete(car.id);
  }
}
