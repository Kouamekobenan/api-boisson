import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DirectSaleRepositoryName,
  IDirectSaleRepository,
} from 'src/directSale/domain/interfaces/directSale-repository.interface';

@Injectable()
export class FindCreditSaleUseCase {
  private readonly logger = new Logger(FindCreditSaleUseCase.name);
  constructor(
    @Inject(DirectSaleRepositoryName)
    private readonly directeSaleRepository: IDirectSaleRepository,
  ) {}
  async execute(tenantId: string, limit: number, page: number) {
    try {
      return await this.directeSaleRepository.findCreditSale(
        tenantId,
        limit,
        page,
      );
    } catch (error) {
      this.logger.error('Failled to retrieve sale with credit', error.stack);
      console.log('error', error);
      throw new BadRequestException('Failled to retrieve sale with credit ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
