import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Invoice } from 'src/invoice/domain/entities/invoice.entity';
import {
  IInvoiceRepository,
  InvoiceRepositoryName,
} from 'src/invoice/domain/interfaces/invoice-repository.interface';
import { IOrderRepository } from 'src/order/application/interface/order-interface-repository';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
interface InvoiceItems {
  orderId: string;
  totalPrice: number;
}
@Injectable()
export class CreateInvoiceUseCase {
  private readonly logger = new Logger(CreateInvoiceUseCase.name);
  constructor(
    @Inject(InvoiceRepositoryName)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,
  ) {}
  async execute(input: InvoiceItems): Promise<Invoice> {
    try {
      const order = await this.orderRepo.findOrderById(input.orderId);
      const dto: CreateInvoiceDto = {
        orderId: input.orderId,
        totalPrice: order.getTotalPrice(),
      };
      const invoice = await this.invoiceRepository.create(dto);
      //   this.logger.log(`Dato to invoices:`, JSON.stringify(invoice));
      return invoice;
    } catch (error) {
      this.logger.error('Failed to create invoice', error.stack);
      throw new BadRequestException('Failed to create invoice', {
        cause: error,
        description: error.message,
      });
    }
  }
}
