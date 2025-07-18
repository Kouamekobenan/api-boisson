import { CreateInvoiceDto } from 'src/invoice/application/dtos/create-invoice.dto';
import { Invoice } from '../entities/invoice.entity';

export const InvoiceRepositoryName = 'IInvoiceRepository';
export interface IInvoiceRepository {
  create(createDto: CreateInvoiceDto): Promise<Invoice>;
  generate(orderId: string): Promise<Invoice>;
  findById(id: string): Promise<Invoice | null>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Invoice[]>;
  paginate(
    page: number,
    limit: number,
  ): Promise<{
    data: Invoice[];
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }>;
}
