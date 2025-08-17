import { CreateDirectSaleDto } from 'src/directSale/application/dtos/directSale/create-directSale.dto';
import { DirectSale } from '../entities/directSale.entity';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';

export const DirectSaleRepositoryName = 'IDirectSaleRepository';
export interface IDirectSaleRepository {
  create(createDto: CreateDirectSaleDto): Promise<DirectSale>;
  findById(id: string): Promise<DirectSale>;
  paginate(
    tenantId:string,
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<DirectSale>>;
  findAll(tenantId:string): Promise<DirectSale[]>;
  delete(id: string): Promise<void>;
  findCreditSale(tenantId:string, limit:number, page: number): Promise<PaginatedResponseRepository<DirectSale>>;
}
