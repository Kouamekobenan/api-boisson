import { StockEntity } from "src/stockMouvement/domain/entities/stock.entity";
import { StockDTO } from "../dtos/create-stock-dto.dto";

export interface IStockRepository{
    createStock(deliveryId:string, productId:string, dataStock:StockDTO):Promise<StockEntity>
}
