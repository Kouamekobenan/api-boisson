import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Invoice } from 'src/invoice/domain/entities/invoice.entity';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';

@Injectable()
export class FindInvoiceByIdUseCase {
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRpository: IInvoiceRepository,
  ) {}
  async execute(id: string): Promise<Invoice | null> {
    try {
      const invoice = await this.invoiceRpository.findById(id);
      if (!invoice) {
        throw new NotFoundException(`Invoice not found: ${id}`);
      }
      return invoice;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve invoice', {
        cause: error,
        description: error.message,
      });
    }
  }
}
