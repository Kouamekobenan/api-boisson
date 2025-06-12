import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDeliveryPersonRepository } from '../interface/deliveryPerson-repository.interface';
import { DeliveryPerson } from 'src/deliveryPerson/domain/entities/deliveryPerson';

@Injectable()
export class DeleteDeliveryPersonUseCase {
  constructor(
    @Inject('IDeliveryPersonRepository')
    private readonly deliveryPersonRepository: IDeliveryPersonRepository,
  ) {}
  async execute(deliveryPersonId: string): Promise<DeliveryPerson> {
    try {
      return await this.deliveryPersonRepository.deleteDeliveryPerson(
        deliveryPersonId,
      );
    } catch (error) {
      throw new BadRequestException('use-case delete:', error);
    }
  }
}
