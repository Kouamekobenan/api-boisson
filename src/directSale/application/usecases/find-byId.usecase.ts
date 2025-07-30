import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DirectSale } from 'src/directSale/domain/entities/directSale.entity';
import {
  DirectSaleRepositoryName,
  IDirectSaleRepository,
} from 'src/directSale/domain/interfaces/directSale-repository.interface';
@Injectable()
export class FindDirecteSaleByIdUseCase {
  private readonly logger = new Logger(FindDirecteSaleByIdUseCase.name);
  constructor(
    @Inject(DirectSaleRepositoryName)
    private readonly directeSaleRepository: IDirectSaleRepository,
  ) {}
  async execute(id: string): Promise<DirectSale> {
    try {
      return await this.directeSaleRepository.findById(id);
    } catch (error) {
      this.logger.error(`Failled to retrieve directeSale ${error.stack}`);
      throw new BadRequestException('Failled to retrieve directeSale ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
