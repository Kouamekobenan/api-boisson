export class Invoice{
    constructor(
        private readonly id:string,
        private orderId:string | null,
        private totalPrice:number,
        private createdAt :Date,
        private updatedAt:Date,
        // private orderItem= []
    ){}
    // SETTERS 
    getId():string{
        return this.id
    }
    getOrderId():string | null{
        return this.orderId
    }
    getTotalPrice():number{
        return this.totalPrice
    }
}