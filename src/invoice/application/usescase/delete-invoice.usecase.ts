import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';

@Injectable()
export class DeleteInvoiceUseCase {
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    try {
      const invoice = await this.invoiceRepository.findById(id);
      if (!invoice) {
        throw new NotFoundException('invoice not found');
      }
      await this.invoiceRepository.delete(id);
      return true;
    } catch (error) {
      throw new BadRequestException('Failed to delete invoice', {
        cause: error,
        description: error.message,
      });
    }
  }
}
