import { DirectSale } from "src/directSale/domain/entities/directSale.entity";

export class Customer {
  constructor(
    private readonly id: string,
    private name: string,
    private phone: string | null,
    private email: string | null,
    private address: string | null,
    private sales: DirectSale,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  //   GETTERS
  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get Phone(): string | null {
    return this.phone;
  }
  get Email(): string | null {
    return this.email;
  }
  get Addres(): string | null {
    return this.address;
  }
}
