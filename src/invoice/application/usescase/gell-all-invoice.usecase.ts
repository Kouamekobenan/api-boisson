import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Invoice } from 'src/invoice/domain/entities/invoice.entity';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';

@Injectable()
export class GetAllInvoiceUseCase {
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}
  async execute(): Promise<Invoice[]> {
    try {
      return await this.invoiceRepository.getAll();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve invoices ', {
        cause: error,
        description: error.message,
      });
    }
  }
}
