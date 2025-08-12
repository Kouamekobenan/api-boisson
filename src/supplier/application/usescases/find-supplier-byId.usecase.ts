import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ISupplierRepository } from '../interface/supplier-interface.repository';
import { SupplierEntity } from 'src/supplier/domain/entities/supplier.entity';

@Injectable()
export class FindByIdSupplierUseCase {
  private readonly logger = new Logger(FindByIdSupplierUseCase.name);
  constructor(
    @Inject('ISupplierRepository')
    private readonly supplierRepository: ISupplierRepository,
  ) {}
  async execute(suplierId: string): Promise<SupplierEntity> {
    try {
      const supplier =
        await this.supplierRepository.findSupplierById(suplierId);
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID:${suplierId} not exist!`);
      }
      return supplier;
    } catch (error) {
      this.logger.error('Failled to retrieve supplier', error.stack);
      throw new BadRequestException('Failled to retrieve supplier', {
        cause: error,
        description: error.message,
      });
    }
  }
}
