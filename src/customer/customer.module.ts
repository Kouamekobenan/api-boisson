import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerController } from './presentation/customer.controller';
import { CustomerMapper } from './domain/mapper/customer.mapper';
import { CustomerRepositoryName } from './domain/interfaces/customer-repository.interface';
import { CustomerRepository } from './infrastruture/customer-repository.impl';
import { CreateCustomerUseCase } from './application/usecases/create-customer.usecase';
import { FindByIdCustomerUseCase } from './application/usecases/find-by-id.usecase';
import { UpdateCustomerUseCase } from './application/usecases/update-customer.usecase';
import { DeleteCustomerUseCase } from './application/usecases/delete-customer.usecase';
import { PaginationCustomerUseCase } from './application/usecases/paginate-customer.usecase';
import { FindAllCustomerUseCase } from './application/usecases/find_all.usecase';

@Module({
  controllers: [CustomerController],
  imports: [],
  providers: [
    // prismaservice
    PrismaService,
    // mappers
    CustomerMapper,
    {
      provide: CustomerRepositoryName,
      useClass: CustomerRepository,
    },
    // use-cases
    CreateCustomerUseCase,
    FindByIdCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    PaginationCustomerUseCase,
    FindAllCustomerUseCase,
  ],
  exports: [],
})
export class CustomerModule {}
