import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerRepositoryName,
  ICustomerRepository,
} from 'src/customer/domain/interfaces/customer-repository.interface';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { Customer } from 'src/customer/domain/entities/customer.entity';

@Injectable()
export class UpdateCustomerUseCase {
  private readonly logger = new Logger(UpdateCustomerUseCase.name);
  constructor(
    @Inject(CustomerRepositoryName)
    private readonly customerRepository: ICustomerRepository,
  ) {}
  async execute(id: string, updateDto: UpdateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        throw new NotFoundException('Customer net found');
      }
      return await this.customerRepository.update(id, updateDto);
    } catch (error) {
      this.logger.error('Failled to update customer', error.stack);
      throw new BadRequestException('Failled to update customer', {
        cause: error,
        description: error.message,
      });
    }
  }
}
