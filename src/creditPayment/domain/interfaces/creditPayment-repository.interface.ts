import { CreateCreditPaymentDto } from 'src/creditPayment/application/dtos/create-creditPayment.dto';
import { CreditPayment } from '../entities/creditPayment.entity';
import { SuccessResponse } from 'src/common/types/response-controller.type';
import { PaginatedResponseRepository } from 'src/common/types/response-respository';
import { UpdateCreditPaymentDto } from 'src/creditPayment/application/dtos/update-creditPayment';

export const CreditPaymentRepositoryName = 'ICreatePaymentRepository';
export interface ICreditPaymentRepository {
  create(dto: CreateCreditPaymentDto): Promise<CreditPayment>;
  findById(id: string): Promise<CreditPayment>;
  create(dto: CreateCreditPaymentDto): Promise<CreditPayment>;
  paginate(
    limit: number,
    page: number,
  ): Promise<PaginatedResponseRepository<CreditPayment>>;
  delete(id: string): Promise<void>;
  update(id: string, dto: UpdateCreditPaymentDto): Promise<CreditPayment>;
}
