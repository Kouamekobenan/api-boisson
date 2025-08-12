export class ProductEntity {
  constructor(
    private readonly id: string,
    private name: string,
    private description: string,
    private price: number,
    private criticalStockThreshold: number,
    private purchasePrice: number,
    private stock: number,
    private supplierId: string,
    private categoryProductId: string | null,
    private tenantId:string |null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  // 🔹 GETTERS
  getId(): string {
    return this.id;
  }
  getpurchasePrice(): number {
    return this.purchasePrice;
  }
  getName(): string {
    return this.name;
  }

  getCriticalStockThreshold():number{
    return this.criticalStockThreshold
  };

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getStock(): number {
    return this.stock;
  }

  getSupplierId(): string {
    return this.supplierId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  getCategoryProductId(): string | null {
    return this.categoryProductId;
  }
  getTenantId():string | null{
    return this.tenantId
  }

  // 🔹 SETTERS avec validations
  setName(name: string): void {
    if (!name.trim())
      throw new Error('Le nom du produit ne peut pas être vide.');
    this.name = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setPrice(price: number): void {
    if (price <= 0) throw new Error('Le prix doit être supérieur à 0.');
    this.price = price;
  }

  setStock(stock: number): void {
    if (stock < 0) throw new Error('Le stock ne peut pas être négatif.');
    this.stock = stock;
  }
}
