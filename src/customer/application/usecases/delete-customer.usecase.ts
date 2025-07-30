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

@Injectable()
export class DeleteCustomerUseCase {
  private readonly logger = new Logger(DeleteCustomerUseCase.name);
  constructor(
    @Inject(CustomerRepositoryName)
    private readonly customerRepository: ICustomerRepository,
  ) {}
  async execute(id: string): Promise<Boolean> {
    try {
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      await this.customerRepository.deleteCustomer(id);
      return true;
    } catch (error) {
      this.logger.error('Failled to delete customer', error.message);
      throw new BadRequestException('Failled to delete cusmtomer ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
