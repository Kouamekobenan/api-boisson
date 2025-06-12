import { StockType } from "../enums/stock.enums";

export class StockEntity{
    constructor(
        private readonly id:string,
        private productId: string,
        private type:StockType,
        private quantity: number,
        private createdAt :Date,
        private deliveryId?:string
    ){}
}