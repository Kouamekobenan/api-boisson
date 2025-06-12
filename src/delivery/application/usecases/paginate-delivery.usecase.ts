import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDeliveryRepository } from '../interface/delivery-repository.interface';

@Injectable()
export class PaginateDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deleveryRepository: IDeliveryRepository,
  ) {}
  async execute(limit: number, page: number) {
    try {
      return await this.deleveryRepository.paginate(limit, page);
    } catch (error) {
      throw new BadRequestException('Failed to paginate delivery', {
        cause: error,
        description: error.message,
      });
    }
  }
}
