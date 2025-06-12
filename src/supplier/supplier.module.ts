import { Module } from "@nestjs/common";
import { SupplierMapper } from "./domain/mappers/supplier-mapper.mapper";
import { SupplierRepository } from "./infrastructure/supplier.repository";
import { CreateSupplierUseCase } from "./application/usescases/create-usecase.supplier-usecase";
import { SupplierController } from "./presentation/supplier.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FindAllSupplierUseCase } from "./application/usescases/find-all-suppliers.use-case";
import { SupplierUpdateUseCase } from "./application/usescases/updte-supplier.use-case";
import { DeleteSupplierUseCase } from "./application/usescases/delete-supplier.use-case";

@Module({
    controllers:[SupplierController],
    imports:[],
    providers:[
        // prismaservice
        PrismaService,
        // mappers
        SupplierMapper,
        {
            provide:'ISupplierRepository',
            useClass:SupplierRepository
        },
        // use-cases
        CreateSupplierUseCase,
        FindAllSupplierUseCase,
        SupplierUpdateUseCase,
        DeleteSupplierUseCase,
        

    ],
    exports:[]
})
export class SupplierModule{}