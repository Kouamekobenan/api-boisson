import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreditPayment } from 'src/creditPayment/domain/entities/creditPayment.entity';
import {
  CreditPaymentRepositoryName,
  ICreditPaymentRepository,
} from 'src/creditPayment/domain/interfaces/creditPayment-repository.interface';

@Injectable()
export class FindByIdCreditPaymentUseCase {
  private readonly logger = new Logger(FindByIdCreditPaymentUseCase.name);
  constructor(
    @Inject(CreditPaymentRepositoryName)
    private readonly creditPaymentRepository: ICreditPaymentRepository,
  ) {}
  async execute(id: string): Promise<CreditPayment> {
    try {
      return await this.creditPaymentRepository.findById(id);
    } catch (error) {
      this.logger.error(`Failled to retrieve creditPayment: ${error.stack}`);
      throw new BadRequestException('Failled to retrieve creditPayment:', {
        cause: error,
        description: error.message,
      });
    }
  }
}
