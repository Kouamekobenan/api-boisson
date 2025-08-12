import { CreateCustomerDto } from "src/customer/application/dtos/create-customer.dto"
import { Customer } from "../entities/customer.entity"
import { UpdateCustomerDto } from "src/customer/application/dtos/update-customer.dto";
import { PaginatedResponseRepository } from "src/common/types/response-respository";

export const CustomerRepositoryName='ICustomerRepository'
export interface ICustomerRepository {
  create(dto: CreateCustomerDto): Promise<Customer>;
  findById(id: string): Promise<Customer>;
  findAll(tenantId:string): Promise<Customer[]>;
  update(id: string, updateDto: UpdateCustomerDto): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  paginate(
    tenantId:string,
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<Customer>>;
}
