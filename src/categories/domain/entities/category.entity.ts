export class CategoryProduct {
  constructor(
    private readonly id: string,
    private name: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
}
