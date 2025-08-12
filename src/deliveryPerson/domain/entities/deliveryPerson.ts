export class DeliveryPerson {
  constructor(
    private readonly id: string,
    private name: string,
    private phone: string | null,
    private createdAt: Date,
    private updatedAt: Date,
    private tenantId: string | null,
  ) {}
  // les setters
  getId(): string {
    return this.id;
  }
  get TenantId(): string | null {
    return this.tenantId;
  }
  getName(): string {
    return this.name;
  }
  getPhone(): string | null {
    return this.phone;
  }
}
