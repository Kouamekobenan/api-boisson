import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreditPaymentRepositoryName } from 'src/creditPayment/domain/interfaces/creditPayment-repository.interface';
import { CreditPaymentRepository } from 'src/creditPayment/infrastructure/creditPayment-repository.impl';

@Injectable()
export class DeleteCreditPaymentUseCase {
  constructor(
    @Inject(CreditPaymentRepositoryName)
    private readonly creditPaymentRepository: CreditPaymentRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const creditPayment = await this.creditPaymentRepository.findById(id);
      if (!creditPayment) {
        throw new NotFoundException('Failled to delete creditPayment');
      }
      await this.creditPaymentRepository.delete(id);
      return true;
    } catch (error) {
      throw new BadRequestException('Failled to delete creditPayment', {
        cause: error,
        description: error.message,
      });
    }
  }
}
