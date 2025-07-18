import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Invoice } from 'src/invoice/domain/entities/invoice.entity';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';

@Injectable()
export class GenerateInvoiceUseCase {
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}
  async execute(orderId: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceRepository.generate(orderId);
      return invoice;
    } catch (error) {
      throw new BadRequestException('Failled to generate invoice ', {
        cause: error.message,
      });
    }
  }
}
