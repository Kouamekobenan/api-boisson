import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CustomerRepositoryName,
  ICustomerRepository,
} from 'src/customer/domain/interfaces/customer-repository.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer } from 'src/customer/domain/entities/customer.entity';

@Injectable()
export class CreateCustomerUseCase {
  private readonly logger = new Logger(CreateCustomerUseCase.name);
  constructor(
    @Inject(CustomerRepositoryName)
    private readonly customerRepository: ICustomerRepository,
  ) {}
  async execute(dto: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.customerRepository.create(dto);
    } catch (error) {
      this.logger.error('Failled to create customer', error.message);
      throw new BadRequestException('Failled to create customer', {
        cause: error,
        description: error.message,
      });
    }
  }
}
