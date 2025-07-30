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
export class DeleteDireteSaleUseCase {
  private readonly logger = new Logger(DeleteDireteSaleUseCase.name);
  constructor(
    @Inject(DirectSaleRepositoryName)
    private readonly directeSaleRepository: IDirectSaleRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      await this.directeSaleRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failled to delete directe sale ${error.message}, `);
      throw new BadRequestException('Failled to delete directe sale');
    }
  }
}
