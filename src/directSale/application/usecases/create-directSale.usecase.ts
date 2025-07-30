import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DirectSaleRepositoryName,
  IDirectSaleRepository,
} from 'src/directSale/domain/interfaces/directSale-repository.interface';
import { CreateDirectSaleDto } from '../dtos/directSale/create-directSale.dto';
import { DirectSale } from 'src/directSale/domain/entities/directSale.entity';
@Injectable()
export class CreateDirecteSaleUseCase {
  private readonly logger = new Logger(CreateDirecteSaleUseCase.name);
  constructor(
    @Inject(DirectSaleRepositoryName)
    private readonly directeSaleRepo: IDirectSaleRepository,
  ) {}
  async execute(createDto: CreateDirectSaleDto): Promise<DirectSale> {
    try {
      if (createDto.amountPaid < 0) {
        throw new ConflictException(
          `Le montant payé ne pas être inferieur ou egale à zéro`,
        );
      }
      const directSale = await this.directeSaleRepo.create(createDto);
      this.logger.log(`Direct sale created: ${JSON.stringify(directSale)}`);
      return directSale;
    } catch (error) {
      this.logger.error('Failled to create directesale', error.stack);
      console.error('Erreur complète :', error);
      throw new BadRequestException('Failled to create directSale', {
        cause: error,
        description: error.message,
      });
    }
  }
}
