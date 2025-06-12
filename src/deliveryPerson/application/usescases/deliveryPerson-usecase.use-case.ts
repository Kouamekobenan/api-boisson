import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDeliveryPersonRepository } from '../interface/deliveryPerson-repository.interface';
import { DeliveryPersonDto } from '../dtos/deliveryPerson-dto.dto';
import { DeliveryPerson } from 'src/deliveryPerson/domain/entities/deliveryPerson';
import { UpdateDeliveryDto } from '../dtos/update-dto.deliveryPerson.dto';

@Injectable()
export class DeliveryPersonUseCase {
  constructor(
    @Inject('IDeliveryPersonRepository')
    private readonly deliveryPersonRepository: IDeliveryPersonRepository,
  ) {}
  async execute(data: UpdateDeliveryDto): Promise<DeliveryPerson> {
    try {
      return await this.deliveryPersonRepository.createdDeliveryPerson(data);
    } catch (error) {
      throw new BadRequestException('Error creating deliveryPerson');
    }
  }
}
