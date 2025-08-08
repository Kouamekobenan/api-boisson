import { Customer } from 'src/customer/domain/entities/customer.entity';
import { DirectSaleItem } from './directSaleItem.entity';
export class DirectSale {
  constructor(
    private readonly id: string,
    private readonly sellerId: string | null,
    private readonly customerId: string | null,
    private totalPrice: number,
    private isCredit: boolean,
    private amountPaid: number,
    private dueAmount: number,
    private saleItems: DirectSaleItem[] = [],
    private createdAt: Date,
    private updatedAt: Date,
    private customer?: Customer | null,
  ) {
    if (amountPaid + dueAmount !== totalPrice) {
      throw new Error('Montant incohérent.');
    }
  }
  addItem(item: DirectSaleItem) {
    this.saleItems.push(item);
    this.totalPrice += item.TotalPrice;
    this.dueAmount = this.totalPrice - this.amountPaid;
    this.updatedAt = new Date();
  }
  pay(amount: number) {
    if (amount <= 0) throw new Error('Montant invalide');
    this.amountPaid += amount;
    this.dueAmount = this.totalPrice - this.amountPaid;
    this.updatedAt = new Date();
  }
  //   Getters
  get Id(): string {
    return this.id;
  }
  get SellerId(): string | null {
    return this.sellerId;
  }
  get CustomerId(): string | null {
    return this.customerId;
  }
  get TotalPrice(): number {
    return this.totalPrice;
  }
  get IsCredit(): boolean {
    return this.isCredit;
  }
  get AmountPaid(): number {
    return this.amountPaid;
  }
  get DueAmount(): number {
    return this.dueAmount;
  }
  get SaleItems(): DirectSaleItem[] {
    return this.saleItems;
  }
}
