import { StockMovement as PrismaStock } from "@prisma/client";
import { StockEntity } from "../entities/stock.entity";
import { StockType } from "../enums/stock.enums";
import { StockDTO } from "src/stockMouvement/application/dtos/create-stock-dto.dto";
export class StockMapper{
    private static readonly isUndefined:string ="isUnDefined"
    toReceive(data:PrismaStock):StockEntity{
        return new StockEntity(
            data.id,
            data.productId,
            data.type as StockType,
            data.quantity,
            data.createdAt,
            data.deliveryId ?? StockMapper.isUndefined,
        )
    }
    toSend(data:StockDTO):any{
        return ({
            type: data.type,
            quantity: data.quantity
        })
    }
}