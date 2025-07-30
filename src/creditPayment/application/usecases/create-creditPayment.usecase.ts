import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreditPaymentRepositoryName, ICreditPaymentRepository } from 'src/creditPayment/domain/interfaces/creditPayment-repository.interface';
import { CreditPaymentRepository } from 'src/creditPayment/infrastructure/creditPayment-repository.impl';
import { CreateCreditPaymentDto } from '../dtos/create-creditPayment.dto';
import { CreditPayment } from 'src/creditPayment/domain/entities/creditPayment.entity';

@Injectable()
export class CreateCreditPaymentUseCase {
  private readonly logger = new Logger(CreateCreditPaymentUseCase.name);
  constructor(
    @Inject(CreditPaymentRepositoryName)
    private readonly creditPaymentRepository: ICreditPaymentRepository,
  ) {}
  async execute(dto: CreateCreditPaymentDto): Promise<CreditPayment> {
    try {
      return await this.creditPaymentRepository.create(dto);
    } catch (error) {
      this.logger.error('Failled to create creditPayment', error.message);
      throw new BadRequestException('Failled to create creditPayment', {
        cause: error,
        description: error.message,
      });
    }
  }
}
