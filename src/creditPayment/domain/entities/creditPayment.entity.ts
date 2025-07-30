export class CreditPayment {
  constructor(
    private readonly id: string,
    private readonly directSaleId: string,
    private amount: number,
    private paidAt: Date,
  ) {}
  //   GETTERS
  get Id(): string {
    return this.id;
  }
  get DirectSaleId(): string {
    return this.directSaleId;
  }
  get Amount(): number {
    return this.amount;
  }
}
