import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';
import { CreditPayment } from 'src/creditPayment/domain/entities/creditPayment.entity';
import {
  CreditPaymentRepositoryName,
  ICreditPaymentRepository,
} from 'src/creditPayment/domain/interfaces/creditPayment-repository.interface';

@Injectable()
export class PaginateCreditPaymentUseCase {
  private readonly logger = new Logger(PaginateCreditPaymentUseCase.name);
  constructor(
    @Inject(CreditPaymentRepositoryName)
    private readonly creditPaymentRepository: ICreditPaymentRepository,
  ) {}
  async execute(
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<CreditPayment>> {
    try {
      return await this.creditPaymentRepository.paginate(limit, page);
    } catch (error) {
      this.logger.error('Failled to retrieve creditPayment', error.message);
      throw new BadRequestException(`Failled to retrieve creditPayment `, {
        cause: error,
        description: error.message,
      });
    }
  }
}
