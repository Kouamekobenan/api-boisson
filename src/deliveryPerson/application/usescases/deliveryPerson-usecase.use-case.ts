import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDeliveryPersonRepository } from '../interface/deliveryPerson-repository.interface';
import { DeliveryPerson } from 'src/deliveryPerson/domain/entities/deliveryPerson';
import { DeliveryPersonDto } from '../dtos/deliveryPerson-dto.dto';

@Injectable()
export class DeliveryPersonUseCase {
  constructor(
    @Inject('IDeliveryPersonRepository')
    private readonly deliveryPersonRepository: IDeliveryPersonRepository,
  ) {}
  async execute(data: DeliveryPersonDto): Promise<DeliveryPerson> {
    try {
      return await this.deliveryPersonRepository.createdDeliveryPerson(data);
    } catch (error) {
      throw new BadRequestException('Error creating deliveryPerson');
    }
  }
}
