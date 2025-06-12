import { UserRole } from '../enums/role.enum';

export class User {
  constructor(
    private readonly id: string,
    private email: string,
    private password: string,
    private name: string | null,
    private phone: string | null,
    private role: UserRole,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  // setter
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }
  getRole(): UserRole {
    return this.role;
  }

  getPassword(): string {
    return this.password;
  }
  getName(): string | null {
    return this.name;
  }
  getPhone(): string | null {
    return this.phone;
  }
}
