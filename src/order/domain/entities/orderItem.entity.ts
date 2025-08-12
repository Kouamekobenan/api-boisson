export class orderItemEntity {
  constructor(
    private readonly id: string,
    private orderId: string,
    private productId: string,
    private quantity: number,
    private unitPrice: number,
    private totalPrice: number,
    private tenantId: string | null,
  ) {
    this.totalPrice = this.quantity * this.unitPrice;
  }

  get TenantId(): string | null {
    return this.tenantId;
  }
  getProductId(): string {
    return this.productId;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getQuantity(): number {
    return this.quantity;
  }
  getTotalPrice(): number {
    return (this.totalPrice = this.quantity * this.unitPrice);
  }
}
