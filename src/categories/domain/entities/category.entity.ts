export class CategoryProduct {
  constructor(
    private readonly id: string,
    private name: string,
    private tenantId:string | null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  getId(): string {
    return this.id;
  }
  get Tenant():string | null{
    return this.tenantId
  }
  getName(): string {
    return this.name;
  }
}
