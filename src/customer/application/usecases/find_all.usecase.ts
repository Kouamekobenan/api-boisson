import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Customer } from "src/customer/domain/entities/customer.entity";
import { CustomerRepositoryName, ICustomerRepository } from "src/customer/domain/interfaces/customer-repository.interface";

@Injectable()
export class FindAllCustomerUseCase{
    private readonly logger=new Logger(FindAllCustomerUseCase.name)
    constructor(
        @Inject(CustomerRepositoryName)
        private readonly customerRepository:ICustomerRepository
    ){}
    async execute():Promise<Customer[]>{
        try {
            return await this.customerRepository.findAll()
        } catch (error) {
            this.logger.error('Failled to retrieve to customer', error.stack)
            throw new BadRequestException('Failled to retrieve to customer', error)
        }
    }
}
