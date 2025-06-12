import { BadRequestException, Injectable } from "@nestjs/common";
import { IStockRepository } from "../application/interface/stock-repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { StockMapper } from "../domain/mappers/stock.mapper";
import { StockDTO } from "../application/dtos/create-stock-dto.dto";
import { StockEntity } from "../domain/entities/stock.entity";
import { Delivery } from "src/delivery/domain/entities/delivery.entity";
import { connect } from "http2";

@Injectable()
export class StockRepository implements IStockRepository{
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: StockMapper
    ){}
    async createStock(deliveryId: string, productId: string, dataStock: StockDTO): Promise<StockEntity> {
        try {
            const dataTsend = this.mapper.toSend(dataStock);
            const newStock =await this.prisma.stockMovement.create({
                data:{...dataTsend,
                    delivery:{
                        connect:{id: deliveryId}
                    },
                    product:{
                        connect:{id:productId}
                    }
                }
            })
            return this.mapper.toReceive(newStock)
        } catch (error) {
            throw new BadRequestException(`error on repository: ${error.message}`)
        }
    }
}