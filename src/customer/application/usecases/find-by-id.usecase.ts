import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Customer } from 'src/customer/domain/entities/customer.entity';
import {
  CustomerRepositoryName,
  ICustomerRepository,
} from 'src/customer/domain/interfaces/customer-repository.interface';

@Injectable()
export class FindByIdCustomerUseCase {
  private readonly logger = new Logger(FindByIdCustomerUseCase.name);
  constructor(
    @Inject(CustomerRepositoryName)
    private readonly customerRepository: ICustomerRepository,
  ) {}
  async execute(id: string): Promise<Customer> {
    try {
      return await this.customerRepository.findById(id);
    } catch (error) {
      this.logger.error(`Failled to retrieve customer`, error.message);
      throw new BadRequestException(
        'Failled to retrieve customer',
        error.message,
      );
    }
  }
}
