import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IStockRepository } from "../interface/stock-repository.interface";
import { StockDTO } from "../dtos/create-stock-dto.dto";
import { StockEntity } from "src/stockMouvement/domain/entities/stock.entity";

@Injectable()

export class CreateStockUseCase{
    constructor(@Inject('IStockRepository')
private readonly stockRepository:IStockRepository){}
async execute(deliveryId:string, productId:string, dataStock:StockDTO):Promise<StockEntity>{
    try {
        return await this.stockRepository.createStock(deliveryId, productId, dataStock)
    } catch (error) {
        throw new BadRequestException(`error on repository:${error.message}`)
    }
    }
}