export class SupplierEntity {
  constructor(
    private readonly id: string,
    private name: string,
    private readonly tenantId: string | null,
    private email: string | null,
    private phone: string | null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  // Getters
  getId(): string {
    return this.id;
  }
  get TenantId(): string | null {
    return this.tenantId;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string |null {
    return this.email;
  }

  getPhone(): string | null {
    return this.phone;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
