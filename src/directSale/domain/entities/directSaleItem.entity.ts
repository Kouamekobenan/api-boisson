export class DirectSaleItem {
  constructor(
    private readonly id: string,
    private readonly directSaleId: string,
    private readonly productId: string,
    private quantity: number,
    private unitPrice: number,
  ) {
    if (quantity <= 0) throw new Error('La quantité doit être positive');
    if (unitPrice <= 0) throw new Error('Le prix unitaire doit être positif');
    this.totalPrice = quantity * unitPrice;
  }
  private totalPrice: number;
  // MÉTHODES MÉTIER
  updateQuantity(newQuantity: number) {
    if (newQuantity <= 0) throw new Error('Quantité invalide');
    this.quantity = newQuantity;
    this.totalPrice = this.quantity * this.unitPrice;
  }
  updateUnitPrice(newPrice: number) {
    if (newPrice <= 0) throw new Error('Prix invalide');
    this.unitPrice = newPrice;
    this.totalPrice = this.quantity * this.unitPrice;
  }
  // GETTERS
  get Id(): string {
    return this.id;
  }
  get DirectSaleId(): string {
    return this.directSaleId;
  }
  get ProductId(): string {
    return this.productId;
  }
  get Quantity(): number {
    return this.quantity;
  }
  get UnitPrice(): number {
    return this.unitPrice;
  }
  get TotalPrice(): number {
    return this.totalPrice;
  }
}
