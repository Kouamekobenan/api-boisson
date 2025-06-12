import { Module } from "@nestjs/common";
import { StockRepository } from "./infrastructure/stock.repository";
import { CreateStockUseCase } from "./application/usecases/create-stock-usecase.use-case";
import { StockMapper } from "./domain/mappers/stock.mapper";
import { StockMouvementController } from "./presentation/stock.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers:[StockMouvementController],
    exports:[],
    providers:[
        {
            provide:"IStockRepository",
            useClass:StockRepository
        },
        // PrismaService
        PrismaService,
        // use-case
        CreateStockUseCase,
        // stockMapper
        StockMapper,
    ],
    imports:[]
})
export class StockModule{}