import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import {
  CustomerRepositoryName,
  ICustomerRepository,
} from 'src/customer/domain/interfaces/customer-repository.interface';

@Injectable()
export class PaginationCustomerUseCase {
  private readonly logger = new Logger(PaginationCustomerUseCase.name);
  constructor(
    @Inject(CustomerRepositoryName)
    private readonly customerRepository: ICustomerRepository,
  ) {}
  async execute(
    tenantId: string,
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<Customer>> {
    try {
      return this.customerRepository.paginate(tenantId, limit, page);
    } catch (error) {
      this.logger.error(
        `Failled to retrieve customer, (limit: ${limit}, page: ${page}) ${error.stack}`,
      );
      throw new BadRequestException(
        'Failled to retrieve customer',
        error.message,
      );
    }
  }
}
