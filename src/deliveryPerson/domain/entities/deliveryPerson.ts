
export class DeliveryPerson{
    constructor(
        private readonly id: string,
        private name:string,
        private phone:string,
        private createdAt:Date,
        private updatedAt:Date
    ){}
    // les setters
    getId(): string{
        return this.id;
    }
    getName(): string{
        return this.name;
    }
    getPhone(): string{
        return this.phone;
    }
}