export class SupplierEntity {
    constructor(
        private readonly id: string,
        private name: string,
        private email: string,
        private phone: string,
        private createdAt: Date,
        private updatedAt: Date
    ) {}

    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPhone(): string {
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
