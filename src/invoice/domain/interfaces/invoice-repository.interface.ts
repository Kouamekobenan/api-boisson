import { CreateInvoiceDto } from 'src/invoice/application/dtos/create-invoice.dto';
import { Invoice } from '../entities/invoice.entity';

export const InvoiceRepositoryName = 'IInvoiceRepository';
export interface IInvoiceRepository {
  create(createDto: CreateInvoiceDto): Promise<Invoice>;
  findById(id: string): Promise<Invoice | null>;
  delete(id: string): Promise<void>;
  getAll():Promise<Invoice[]>
}
