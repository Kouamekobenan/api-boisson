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
export class PaginateDirecteSaleUseCase {
  private readonly logger = new Logger(PaginateDirecteSaleUseCase.name);
  constructor(
    @Inject(DirectSaleRepositoryName)
    private readonly directeRepository: IDirectSaleRepository,
  ) {}
  async execute(tenantId: string, limit: number, page: number) {
    try {
      return await this.directeRepository.paginate(tenantId, limit, page);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve directeSale: page:${page}, limit:${limit} , error:${error.stack}`,
      );
      throw new BadRequestException('Failled to retrieve directeSale', {
        cause: error,
        description: error.message,
      });
    }
  }
}
