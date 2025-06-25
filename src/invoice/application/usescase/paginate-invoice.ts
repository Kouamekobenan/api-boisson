import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';

@Injectable()
export class PaginateInvoiceUseCase {
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}
  async execute(page: number, limit: number) {
    try {
      const invoices = await this.invoiceRepository.paginate(page, limit);
      return invoices;
    } catch (error) {
      throw new BadRequestException('Failled to pagination invoices', {
        cause: error,
        description: error.message,
      });
    }
  }
}
