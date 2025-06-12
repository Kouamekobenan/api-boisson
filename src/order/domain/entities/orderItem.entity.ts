export class orderItemEntity {
  constructor(
    private readonly id: string,
    private orderId: string,
    private productId: string,
    private quantity: number,
    private unitPrice: number,
    private totalPrice: number,
  ) {
    this.totalPrice = this.quantity * this.unitPrice;
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
